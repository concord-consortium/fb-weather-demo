import { types, onSnapshot, applySnapshot } from "mobx-state-tree";
import { dataStore } from "../data-store";

const _ = require("lodash");

// TODO: Lets get this somewhere else besides the dataStore
const firebase = dataStore.firebaseImp;
let maxStart = 0;

export const Firebasify = (model:any, relativeDataPath:string, callback?:Function) => {
  console.log(`★ adding listener for ${relativeDataPath}`);
  let isFirstTime = true;
  const firebaseListener = {
    setState(newData:any) {
      const dotPath = relativeDataPath.replace(/\//g,".");
      const myData = _.get(newData,relativeDataPath);
      if(myData !== undefined){
        console.log(`Calling applySnapshot for ${relativeDataPath}`);
        if (myData.presences) {
          _.each(myData.presences, (v: any, k: string) => {
            console.log(`★ IN ${k}: ${v.start}`);
          });
        }
        applySnapshot(model, myData);
      }
      if(isFirstTime) {
        isFirstTime = false;
        console.log(`★ first time`);
        if(callback) {
          callback();
        }
      }
    },
    // Ignore these sessionlistening methods... Don't think we need them.
    setSessionPath(path:string) { console.log(` ★ session changed: ${path}`);},
    setSessionList(sessions:string[]) { return; }
  };

  // TBD: track these, so that we can optionally remove them?
  firebase.addListener(firebaseListener);

  onSnapshot(model, (newSnapshot:any) => {
    let abort = false;
    console.log(`Calling saveToRelativePath for ${relativeDataPath}`);
    if(newSnapshot.presences) {
      _.each(newSnapshot.presences, (v:any, k:string) => {
        console.log(`★ OUT ${k}: ${v.start}`);
        // if(v.start > maxStart) {
        //   maxStart = v.start;
        // } else {
        //   console.log(`★FAIL`);
        //   abort = true;
        // }
      });
    }
    if(abort) { return ; }
    firebase.saveToRelativePath(newSnapshot, relativeDataPath);
  });
};

