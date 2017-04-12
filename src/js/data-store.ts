import { observable, computed } from "mobx";
import { v1 as uuid } from "uuid";
import { Frame} from "./frame";
import { GridFormat, GridFormatMap, Grid } from "./grid";
import { Basestation, BasestationMap } from "./basestation";
import { SimPrefs } from "./sim-prefs";
import { FirebaseImp } from "./firebase-imp";
import { FrameHelper } from "./frame-helper";
import { Presence, PresenceMap } from "./presence";

const _ = require("lodash");

type NowShowingType = "loading" | "choose" | "teacher" | "student" | "classroom" | "setup";

export interface Prediction {
  name?: string
  temp?: number
  rationale?: string
  imageUrl?: string
  gridX?: number
  gridY?: number
}

export interface PredictionMap {
  [key:string]: Prediction
}

export interface FireBaseState {
  frame?: number
  frames?: Frame[]
  prefs?: SimPrefs
  predictions?: PredictionMap
  presence?: PresenceMap
  basestations?: BasestationMap
  gridFormats?: GridFormatMap
}

class DataStore {
  @observable nowShowing:NowShowingType
  @observable frameNumber: number
  @observable frames: Frame[]
  @observable prefs: SimPrefs
  @observable predictions: PredictionMap
  @observable presenceMap: PresenceMap
  @observable basestationMap: BasestationMap
  @observable basestation: Basestation | null
  @observable gridFormatMap: GridFormatMap
  @observable gridFormat: GridFormat | null
  firebaseImp : FirebaseImp

  constructor() {
    this.nowShowing = "loading"
    this.frameNumber = 0;
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
    this.presenceMap = {};
    this.predictions = {};
    this.basestationMap = {};
    this.gridFormatMap = {}
    this.registerFirebase();
  }

  registerFirebase() {
    this.firebaseImp = new FirebaseImp();
    this.firebaseImp.addListener(this);
    this.setNowShowing("loading");
    this.firebaseImp.initFirebase( ()=> {
      const frameHelper = new FrameHelper();
      frameHelper.parse();
      this.setFrame(0);
      this.setFrames(frameHelper.frames);
    });
  }

  setNowShowing(_new:NowShowingType) {  this.nowShowing = _new; }

  setState(newState:FireBaseState) {
    if(newState.frames)      { (this.frames as any).replace(newState.frames); }
    if(newState.frame)       { this.frameNumber = newState.frame; }
    if(newState.prefs)       { this.prefs = observable(newState.prefs); }
    if(newState.predictions) { this.predictions = observable(newState.predictions); }
    if(newState.presence)    { this.presenceMap = observable(newState.presence);}
    if(newState.basestations){ this.basestationMap = observable(newState.basestations);}
    if(newState.gridFormats) { this.gridFormatMap = observable(newState.gridFormats);}
  }

  @computed get prediction() {
    const uuid = this.firebaseImp.sessionID;
    const defaultPrediction  = {
      precictedTemp: null,
      rationale: null,
      imageUrl: null
    };
    this.predictions[uuid] = this.predictions[uuid] || observable(defaultPrediction);
    return this.predictions[uuid];
  }

  @computed get sessionInfo() {
    const uuid = this.firebaseImp.sessionID;
    const defaultPresence  = {
      name: "",
      id: "",
      baseStationId: "none"
    };
    return this.presenceMap[uuid] || observable(defaultPresence);
  }

  // in list form instead of Map
  @computed get basestations () {
     return _.map(this.basestationMap, (b:Basestation) => {return b});
  }

  @computed get gridFormats() {
    return _.map(this.gridFormatMap, (g:GridFormat) => {return g});
  }

  @computed get frame() {
    return this.frames[this.frameNumber];
  }

  @computed get grid() {
    const formatName = this.gridFormat ? this.gridFormat.name : ""
    if(this.frame && this.frame.grids) {
      return this.frame.grids[formatName]
    }
    return new Grid()
  }

  @computed get filteredPredictions() {
    const predictionKeys = _.keys(this.predictions);
    const presenceKeys   = _.keys(this.presenceMap);
    const results:Prediction[] = [];
    for(let i=0; i < presenceKeys.length; i++) {
      let key = presenceKeys[i];
      let presence  = this.presenceMap[key];
      let basestation = this.basestationMap[presence.baseStationId]
      if(basestation && basestation.gridX && basestation.gridY){
        if(_.includes(predictionKeys, key)){
          let prediction = this.predictions[key];
          results.push({
            name: basestation.name,
            gridX: basestation.gridX,
            gridY: basestation.gridY,
            temp: prediction.temp
          });
        }
      }
    }
    return results;
  }

  set sessionInfo(baseChange:Presence) {
    const uuid = this.firebaseImp.sessionID;
    _.assignIn(this.presenceMap[uuid], baseChange);
    this.firebaseImp.saveUserData(this.presenceMap[uuid]);
  }

  nextFrame(){
    const frameLength = this.frames.length;
    let frameNumber = (this.frameNumber || 0) + 1;
    frameNumber = frameNumber % frameLength;
    this.setFrame(frameNumber);
  }

  setFrame(frame:number) {
    this.frameNumber = frame;
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
  }

  setPrediction(prediction:Prediction) {
    const uuid = this.firebaseImp.sessionID;
    this.predictions[uuid] = prediction;
    this.save({predictions: this.predictions})
  }

  addBasestation() {
    const bs = new Basestation();
    this.basestationMap[bs.id] = bs;
    this.basestation = bs;
    this.save({basestations: this.basestationMap});
  }

  saveBasestation() {
    if (this.basestation) {
      const key = `basestations/${this.basestation.id}`
      this.saveToPath(key,this.basestation);
    }
  }

  deleteBasestation(base:Basestation|null){
    if(base) {
      delete this.basestationMap[base.id];
      this.basestation = null;
      this.save({basestations: this.basestationMap});
    }
  }

  addGridFormat() {
    const grid = new GridFormat();
    this.gridFormatMap[grid.id] = grid;
    this.gridFormat = grid;
    this.save({gridFormats: this.gridFormatMap});
  }

  saveGridFormat() {
    if (this.gridFormat) {
      const key = `gridFormats/${this.gridFormat.id}`
      this.saveToPath(key,this.gridFormat);
    }
  }

  deleteGridFormat(grid:GridFormat) {
    delete this.gridFormatMap[grid.id];
    this.gridFormat = null;
    this.save({gridFormats: this.gridFormatMap});
  }

  saveToPath(key:string, value:any) {
    const obj:any = {};
    obj[key] = value;
    this.firebaseImp.saveToFirebase(obj);
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