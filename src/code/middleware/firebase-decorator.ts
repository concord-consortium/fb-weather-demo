import { onSnapshot, applySnapshot } from "mobx-state-tree";
import { gFirebase, FirebaseData, FirebaseRef} from "./firebase-imp";

export const Firebasify = (model:any, relativeDataPath:string) => {
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
        pendingRef.then((ref:FirebaseRef) => {
          ref.update(newSnapshot);
        });
      });
    });
  });

};
