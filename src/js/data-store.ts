import { action, observable, computed } from "mobx";
import { Frame} from "./frame";
import { SimPrefs } from "./sim-prefs";
import { FirebaseImp } from "./firebase-imp";
import * as _ from "lodash";

type NowShowingType = "choose" | "teacher" | "student" | "classroom"

export interface Prediction {
  precictedTemp?: number
  rationale?: string
  imageUrl?: string
}

export interface BaseStation {
  name: string
  gridX: number
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
      enablePrediction: false,
      showPredictions: false
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
    const uuid = this.firebaseImp.uuid;
    const defaultPrediction  = {
      precictedTemp: null,
      rationale: null,
      imageUrl: null
    };
    this.predictions[uuid] = this.predictions[uuid] || observable(defaultPrediction);
    return this.predictions[uuid];
  }

  @computed get basestation() {
    const uuid = this.firebaseImp.uuid;
    const defaultBasestation  = {
      name: "",
      gridX: 0,
      gridY: 0
    };
    return this.presence[uuid] || observable(defaultBasestation);;
  }

  @computed get filteredPredictions() {
    const predictionKeys = _.keys(this.predictions);
    const presenceKeys   = _.keys(this.presence);
    const results = [];
    for(let i=0; i < presenceKeys.length; i++) {
      let key = presenceKeys[i];
      let basestation  = this.presence[key];
      if(basestation.gridX && basestation.gridY){
        if(_.includes(predictionKeys, key)){
          let prediction = this.predictions[key];
          results.push({
            name: basestation.name,
            gridX: basestation.gridX,
            gridY: basestation.gridY,
            temp: prediction.precictedTemp
          });
        }
      }
    }
    return results;
  }

  set basestation(baseChange:BaseStation) {
    const uuid = this.firebaseImp.uuid;
    _.assignIn(this.presence[uuid],baseChange);
    this.firebaseImp.saveUserData(this.presence[uuid]);
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
    const uuid = this.firebaseImp.uuid;
    this.predictions[uuid] = prediction;
    this.save({predictions: this.predictions})
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