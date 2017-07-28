import { types, onSnapshot, applySnapshot } from "mobx-state-tree";
import { dataStore } from "../data-store";

const _ = require("lodash");

// TODO: Lets get this somewhere else besides the dataStore
const firebase = dataStore.firebaseImp;

export const Firebasify = (model:any, relativeDataPath:string) => {
  const firebaseListener = {
    setState(newData:any) {
      const dotPath = relativeDataPath.replace(/\//g,".");
      const myData = _.get(newData,relativeDataPath);
      if(myData !== undefined){
        applySnapshot(model, myData);
      }
    },
    // ignore these listener methods. TODO: remove from API
    setSessionPath(path:string) { return; },
    setSessionList(sessions:string[]) { return; }
  };

  // TBD: track these, so that we can optionally remove them?
  firebase.addListener(firebaseListener);

  onSnapshot(model, (newSnapshot:any) => {
    firebase.saveToRelativePath(newSnapshot, relativeDataPath);
  });

};

