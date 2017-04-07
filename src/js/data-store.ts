import { action, observable, computed } from "mobx";
import * as _ from "lodash";

import { Frame} from "./frame";
import { Grid } from "./grid";
import { SimPrefs } from "./sim-prefs";
import { FirebaseImp } from "./firebase-imp";
import { FrameHelper } from "./frame-helper";

type NowShowingType = "loading" | "choose" | "teacher" | "student" | "classroom"

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
    this.nowShowing = "loading"
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
    this.setNowShowing("loading");
    this.firebaseImp.initFirebase( ()=> {
      const frameHelper = new FrameHelper(this.loadFrames);
      console.log("firebase registered");
      // this.setNowShowing("choose");
    });
  }

  loadFrames() {
    const loadCallback = function() {
    this.setFrame(0);
    this.setFrames(this.frameHelper.frames);
    this.setState({
      session: "default",
      prefs: {
        showBaseMap: false
      }
    });
  }

  }

  setNowShowing(_new:NowShowingType) {  this.nowShowing = _new; }

  setState(newState:FireBaseState) {
    if(newState.frames)      { (this.frames as any).replace(newState.frames); }
    if(newState.frame)       { this.frame = newState.frame; }
    if(newState.prefs)       { this.prefs = observable(newState.prefs); }
    if(newState.predictions) { this.predictions = observable(newState.predictions); }
    if(newState.presence)    { this.presence = observable(newState.presence);}
  }

  @computed get prediction() {
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

  @computed get grid():Grid {
    const frame = this.frame;
    const gridName = this.prefs.gridName;
    const frames = this.frames;
    let grid:Grid | undefined = undefined;
    if (frames && frames.length > 0 && frames[frame].grids) {
      if(frames[frame].grids[gridName]) {
        grid = frames[frame].grids[gridName];
      }
    }
    return grid
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
    this.setFrame(frameNumber);
  }

  setFrame(frame:number) {
    this.frame = frame;
    this.save({frame: frame});
  }

  setFrames(frames:Frame[]) {
    this.save({frames: frames});
  }

  setPref(key:string, value:any) {
    this.prefs[key] = value;
    this.save({prefs: this.prefs});
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