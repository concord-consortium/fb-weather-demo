import * as firebase from "firebase";

import { onSnapshot, applySnapshot } from "mobx-state-tree";
import { gFirebase } from "./firebase-imp";

export const Firebasify = (model:any, relativeDataPath:string, callBack?:() => void) => {
  const pendingRef = gFirebase.refForPath(relativeDataPath);
  const updateModelFromFirebase = (newV:firebase.database.DataSnapshot) => {
    const v = newV.val();
    if(v) {
      applySnapshot(model, v);
    }
  };
  pendingRef.then((ref:firebase.database.Reference) => {
    function updateFirebaseFromModel(snapshot:any) {
      const data = model.filterOutboundData ? model.filterOutboundData(snapshot) : snapshot,
            presence = model.outboundPresence && model.outboundPresence(snapshot),
            presenceRef = presence && ref.child(`presences/presences/${presence.id}`);
      // update the object (minus any filtered properties)
      ref.update(data);
      // update our presence separately
      if (presenceRef) {
        presenceRef.update(presence);
      }
    }
    ref.once('value').then( (newV:firebase.database.DataSnapshot) => {
      updateModelFromFirebase(newV);
      ref.on('value', updateModelFromFirebase);
      onSnapshot(model, (newSnapshot:any) => updateFirebaseFromModel(newSnapshot));
      if (callBack) { setTimeout(() => callBack(), 1); }
    });
  });

};
