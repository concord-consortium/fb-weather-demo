import { action, observable, computed } from "mobx";
import { Frame} from "./frame";
import { SimPrefs } from "./sim-prefs";
import { FirebaseImp } from "./firebase-imp";

type NowShowingType = "choose" | "teacher" | "student" | "classroom"

export interface Prediction {
  precictedTemp?: number
  rationale?: string
  imageUrl?: string
}

export interface BaseStation {
  name: string
  grdX: number
  gridY: number
}


export interface FireBaseState {
  frame?: number
  frames?: Frame[]
  prefs?: SimPrefs
  predictions: {}
  presence: {}
}

class DataStore {
  @observable nowShowing:NowShowingType
  @observable frame: number
  @observable frames: Frame[]
  @observable prefs: SimPrefs
  @observable predictions: {}
  @observable presence: {}
  firebaseImp : any
  uuid: string

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
    this.presence = observable({
      name: "noName",
      online: false,
      start: "not started",
      gridX: 0,
      gridY: 0
    });
    this.predictions = {};
    this.registerFirebase();
    this.uuid = this.firebaseImp.uuid;

  }

  registerFirebase() {
    this.firebaseImp = new FirebaseImp();
    this.firebaseImp.addListener(this);
    console.log("firebase registered");
  }

  @action setNowShowing(_new:NowShowingType) {  this.nowShowing = _new; }

  @action setState(newState:FireBaseState) {
    if(newState.frames)      { (this.frames as any).replace(newState.frames); }
    if(newState.frame)       { this.frame = newState.frame; }
    if(newState.prefs)       { this.prefs = observable(newState.prefs); }
    if(newState.predictions) { this.predictions = observable(newState.predictions); }
    if(newState.presence)    { this.presence = observable(newState.presence);}
  }

  get prediction() {
    const defaultPrediction  = {
      precictedTemp: null,
      rationale: null,
      imageUrl: null
    };
    this.predictions[this.uuid] = this.predictions[this.uuid] || observable(defaultPrediction);
    return this.predictions[this.uuid];
  }

  @computed get  basestation() {
    const defaultBasestation  = {
      name: null,
      gridX: 0,
      gridY: 0
    };
    return this.presence[this.uuid] || observable(defaultBasestation);;
  }

  nextFrame(){
    const frameLength = this.frames.length;
    let frameNumber = (this.frame || 0) + 1;
    frameNumber = frameNumber % frameLength;
    dataStore.setFrame(frameNumber);
  }

  setFrame(frame:number) {
    this.save({frame: frame});
  }

  setFrames(frames:Frame[]) {
    this.save({frames: frames});
  }

  setPrefs(prefs:SimPrefs) {
    this.save({prefs: prefs});
  }

  setSession(session:string) {
    this.firebaseImp.session = session;
    this.firebaseImp.setDataRef();
  }

  setPrediction(prediction:Prediction) {
    this.predictions[this.uuid] = prediction;
    this.save({predictions: this.predictions})
  }

  setBasestation(base:BaseStation) {
    this.presence[this.uuid].update(base);
    this.firebaseImp.saveUserData(base);
    // this.save({presence: this.presence});
  }

  save(obj:any){
    this.firebaseImp.saveToFirebase(obj);
  }

  unregisterFirebase() {
    this.firebaseImp.removeListener(this);
    console.log("firebase unregistered");
    return true;
  }

}

export const dataStore = new DataStore();