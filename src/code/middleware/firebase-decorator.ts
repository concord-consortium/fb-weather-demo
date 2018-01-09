import { onSnapshot, applySnapshot } from "mobx-state-tree";
import { gFirebase, FirebaseData, FirebaseRef} from "./firebase-imp";
import * as _ from "lodash";

export const Firebasify = (model:any, relativeDataPath:string, callBack?:()=> void) => {
  const pendingRef = gFirebase.refForPath(relativeDataPath);
  const updateFunc = (newV:FirebaseData) => {
    const v = newV.val();
    if(v) {
      applySnapshot(model, v);
    }
  };
  pendingRef.then((ref:FirebaseRef) => {
    ref.once('value').then( (newV:FirebaseData) => {
      updateFunc(newV);
      ref.on('value',updateFunc);
      onSnapshot(model, (newSnapshot:any) => {
        let data = _.clone(newSnapshot);
        if(model.filterOutboundData) {
          data = model.filterOutboundData(data);
        }
        ref.update(data);
      });
      if(callBack) {
        setTimeout( ()=> {
          callBack();
        }, 1);
      }
    });
  });

};
