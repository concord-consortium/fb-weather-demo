import * as firebase from "firebase";
import { onSnapshot, applySnapshot } from "mobx-state-tree";
import { gFirebase } from "./firebase-imp";
import { ISimulationSnapshot } from "../models/simulation";
import { urlParams } from "../utilities/url-params";
import { cloneDeep } from "lodash";

export const Firebasify = (model:any, relativeDataPath:string, callBack?:() => void) => {
  const pendingRef = gFirebase.refForPath(relativeDataPath);
  let updateModelFromFirebaseCount = 0;
  const updateModelFromFirebase = (newV:firebase.database.DataSnapshot) => {
    let v: ISimulationSnapshot = newV.val();
    if(v) {
      // simulation should be stopped on initial teacher launch
      if (urlParams.isTeacher && (++updateModelFromFirebaseCount === 1) &&
          v.control && v.control.isPlaying) {
        v = cloneDeep(v);
        v.control.isPlaying = false;
      }
      applySnapshot(model, v);
    }
  };
  pendingRef.then((ref:firebase.database.Reference) => {
    let lastJSONPresence: string|null = null;
    function updateFirebaseFromModel(snapshot:any) {
      const [data, update] = model.filterOutboundData ? model.filterOutboundData(snapshot) : [snapshot, true],
            presence = model.outboundPresence && model.outboundPresence(snapshot),
            presenceRef = presence && ref.child(`presences/presences/${presence.id}`);
      // update the object (minus any filtered properties)
      if (update) {
        ref.update(data);
      }
      // update our presence separately
      if (presenceRef) {
        // only send presence if it changes
        const jsonPresence = JSON.stringify(presence);
        if (jsonPresence !== lastJSONPresence) {
          presenceRef.update(presence);
        }
        lastJSONPresence = jsonPresence;
      }
    }
    let onValueCount = 0;
    ref.on('value', (newV:firebase.database.DataSnapshot) => {
      updateModelFromFirebase(newV);
      if (++onValueCount === 1) {
        onSnapshot(model, (newSnapshot:any) => updateFirebaseFromModel(newSnapshot));
        if (callBack) { setTimeout(() => callBack(), 1); }
      }
    });
  });

};
