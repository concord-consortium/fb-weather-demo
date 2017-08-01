import { types, onSnapshot, applySnapshot } from "mobx-state-tree";
import { dataStore } from "../data-store";

const _ = require("lodash");

// TODO: Lets get this somewhere else besides the dataStore
const firebase = dataStore.firebaseImp;
let maxStart = 0;

export const Firebasify = (model:any, relativeDataPath:string, callback?:Function) => {
  let isFirstTime = true;
  const firebaseListener = {
    setState(newData:any) {
      const dotPath = relativeDataPath.replace(/\//g,".");
      const myData = _.get(newData,relativeDataPath);
      if(myData !== undefined){
        // console.log(`Calling applySnapshot for ${relativeDataPath}`);
        applySnapshot(model, myData);
      }
      if(isFirstTime) {
        isFirstTime = false;
        if(callback) {
          callback();
        }
      }
    },
    // Ignore these sessionlistening methods... Don't think we need them.
    setSessionPath(path:string) { return;},
    setSessionList(sessions:string[]) { return; }
  };

  // TBD: track these, so that we can optionally remove them?
  firebase.addListener(firebaseListener);

  onSnapshot(model, (newSnapshot:any) => {
    // console.log(`Calling saveToRelativePath for ${relativeDataPath}`);
    firebase.saveToRelativePath(newSnapshot, relativeDataPath);
  });
};

