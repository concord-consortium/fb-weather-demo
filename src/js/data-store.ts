import { extendObservable, computed } from "mobx";

export class DataStore {
  state = {

  };
  constructor(){
    extendObservable(this, {
      frame: 0,
      frames: [],
      session:    "default",
      nowShowing: "choose",
      numFrames: computed( () => frames.length),
      prefs: {
        showBaseMap: false
      }
    });
  }

}