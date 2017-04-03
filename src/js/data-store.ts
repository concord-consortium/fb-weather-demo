import { action, observable, computed } from "mobx";
import { Frame } from "./frame";
import { SimPrefs } from "./sim-prefs";
import { FirebaseImp } from "./firebase-imp";

type NowShowingType = "choose" | "teacher" | "student" | "classroom"

export interface FireBaseState {
  frame?: number
  frames?: Frame[]
  prefs?: SimPrefs
}
class DataStore {
  @observable nowShowing:NowShowingType
  @observable frame: number
  @observable frames: Frame[]
  @observable prefs: SimPrefs
  firebaseImp : any

  constructor() {
    this.nowShowing = "choose"
    this.frame = 0;
    this.frames = [];
    this.prefs = {
      gridName: 'default',
      gridNames: ['default'],
      showBaseMap: true,
      showTempColors: false,
      showTempValues: false,
      showGridLines: false,
      enablePrediction: false
    }
    this.firebaseImp = new FirebaseImp();
    this.registerFirebase()
  }

  registerFirebase() {
    console.log("firebase registered");
    this.firebaseImp.addListener(this);
  }

  @action setNowShowing(_new:NowShowingType) {  this.nowShowing = _new; }

  @action setState(newState:FireBaseState) {
    if(newState.frames) { this.setFrames(newState.frames);  }
    if(newState.frame)  { this.setFrame(newState.frame);    }
    if(newState.prefs)  { this.setPrefs(newState.prefs);    }
  }

  setFrame(frame:number) {
    this.firebaseImp.saveToFirebase({frame: frame});
  }

  setFrames(frames:Frame[]) {
    this.firebaseImp.saveToFirebase({frames: frames});
  }

  setPrefs(prefs:SimPrefs) {
      this.firebaseImp.saveToFirebase({prefs: prefs});
  }
  setSession(session:string) {
    this.firebaseImp.session = session;
    this.firebaseImp.setDataRef();
  }

  unregisterFirebase() {
    this.firebaseImp.removeListener(this);
    console.log("firebase unregistered");
    return true;
  }

}

export const dataStore = new DataStore();