import { onSnapshot, applySnapshot } from "mobx-state-tree";
import { gFirebase, FirebaseData, FirebaseRef} from "./firebase-imp";

export const Firebasify = (model:any, relativeDataPath:string, callBack?:()=> void) => {
  const pendingRef = gFirebase.refForPath(relativeDataPath);
  const updateFunc = (newV:FirebaseData) => {
    const v = newV.val();
    if(v) {
      // console.log("Upadating model:");
      // console.log(v);
      applySnapshot(model, v);
    }
  };
  pendingRef.then((ref:FirebaseRef) => {
    ref.once('value').then( (newV:FirebaseData) => {
      updateFunc(newV);
      ref.on('value',updateFunc);
      onSnapshot(model, (newSnapshot:any) => {
        // console.log("updating firebase from model");
        // console.log(newSnapshot);
        ref.update(newSnapshot);
      });
      if(callBack) {
        setTimeout( ()=> {
          console.log("In callback");
          callBack();
        }, 5000);
      }
    });
  });

};
