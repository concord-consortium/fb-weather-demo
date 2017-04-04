import { action, observable, computed } from "mobx";
import { Frame} from "./frame";
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
    this.registerFirebase()
  }

  registerFirebase() {
    this.firebaseImp = new FirebaseImp();
    this.firebaseImp.addListener(this);
    console.log("firebase registered");
  }

  @action setNowShowing(_new:NowShowingType) {  this.nowShowing = _new; }

  @action setState(newState:FireBaseState) {
    if(newState.frames) { (this.frames as any).replace(newState.frames);  }
    if(newState.frame)  { this.frame = newState.frame;                    }
    if(newState.prefs)  { this.prefs = observable(newState.prefs) ;       }
  }

  nextFrame(){
    const frameLength = this.frames.length;
    let frameNumber = (this.frame || 0) + 1;
    frameNumber = frameNumber % frameLength;
    dataStore.setFrame(frameNumber);
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