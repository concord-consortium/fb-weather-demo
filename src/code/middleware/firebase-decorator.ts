import { onSnapshot, applySnapshot } from "mobx-state-tree";
import { gFirebase } from "./firebase-imp";

const _ = require("lodash");

export const Firebasify = (model:any, relativeDataPath:string, callback?:Function) => {
  let isFirstTime = true;
  const firebaseListener = {
    setState(newData:any) {
      // const dotPath = relativeDataPath.replace(/\//g,".");
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
  gFirebase.addListener(firebaseListener);

  onSnapshot(model, (newSnapshot:any) => {
    // console.log(`Calling saveToRelativePath for ${relativeDataPath}`);
    gFirebase.saveToRelativePath(newSnapshot, relativeDataPath);
  });
};

