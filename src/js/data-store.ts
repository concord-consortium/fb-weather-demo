import { observable, computed, IObservableValue } from "mobx";
import { v1 as uuid } from "uuid";
import { Basestation, BasestationMap } from "./basestation";
import { SimPrefs } from "./sim-prefs";
import { FirebaseImp } from "./firebase-imp";
import { FrameHelper } from "./frame-helper";
import { MapConfig, MapConfigMap } from "./map-config";

const _ = require("lodash");

export interface Prediction {
  name?: string;
  temp: number;
  rationale: string;
  imageUrl?: string;
}

export interface PredictionMap {
  [key: string]: Prediction;
}

export interface FireBaseState {
  frameNumber?: number;
  maxFrame: number;
  prefs?: SimPrefs;
  predictions?: PredictionMap;
  basestations?: BasestationMap;
  mapConfigs?: MapConfigMap;
}

class DataStore {
  @observable frameNumber: IObservableValue<number>;
  @observable maxFrame: IObservableValue<number>;
  @observable prefs: SimPrefs;
  @observable predictions: PredictionMap;
  @observable basestationMap: BasestationMap;
  @observable mapConfigMap: MapConfigMap;
  @observable editingMap: MapConfig | null;
  @observable sessionList: string[];
  @observable sessionPath: string;
  firebaseImp: FirebaseImp;

  constructor() {
    this.frameNumber = observable(0);
    this.maxFrame = observable(0);
    this.prefs = {
      showBaseMap: true,
      showTempColors: false,
      showTempValues: false,
      showDeltaTemp: false,
      showStationNames: false,
      enablePrediction: false,
      showPredictions: false
    };
    this.predictions = {};
    this.basestationMap = observable({} as BasestationMap);
    this.mapConfigMap = {};
    this.sessionList = [];
    this.registerFirebase();
  }

  registerFirebase() {
    this.firebaseImp = new FirebaseImp();
    this.firebaseImp.addListener(this);
    this.firebaseImp.initFirebase(() => {
      // TBD: Initialize an empty instance
    });
  }

  setSessionList(newSessions: string[]) {
    this.sessionList = observable(newSessions);
  }

  setState(newState: FireBaseState) {
    if (newState.frameNumber) {
      this.frameNumber.set(newState.frameNumber);
    }

    if (newState.maxFrame) {
      this.maxFrame.set(newState.maxFrame);
    }

    if (newState.prefs) {
      this.prefs = observable(newState.prefs);
    } else {
      this.setPrefs(new SimPrefs());
    }

    if (newState.predictions) {
      this.predictions = observable(newState.predictions);
    } else {
      this.predictions = observable({} as PredictionMap);
    }

    if (newState.basestations) {
      this.basestationMap = observable(newState.basestations);
    } else {
      this.basestationMap = observable({} as BasestationMap);
    }

    if (newState.mapConfigs) {
      this.mapConfigMap = observable(newState.mapConfigs);
    } else {
      this.mapConfigMap = observable({} as MapConfigMap);
    }
  }

  // in list form instead of Map
  @computed
  get basestations() {
    return _.map(this.basestationMap, (b: Basestation) => {
      return b;
    });
  }

  @computed
  get mapConfigs() {
    return _.map(this.mapConfigMap, (g: MapConfig) => {
      return g;
    });
  }


  @computed
  get timeString():string {
    const frameNumber = this.frameNumber.get();
    const missingTimeString = `(${frameNumber})`;
    for(let base of this.basestations) {
       const basestation = new Basestation(base);
       const timeString = basestation.dateForFrame(frameNumber);
       if(timeString){
         return timeString;
       }
    }
    return missingTimeString;
  }

  @computed
  get mapConfig() {
    if (this.prefs.mapConfig) {
      return this.mapConfigMap[this.prefs.mapConfig];
    }
    return null;
  }

  set mapConfig(config: any) {
    this.setPref("mapConfig", config.id);
  }

  predictionFor(basestationId: string):Prediction | null{
    if (this.predictions[basestationId] !== undefined) {
      return this.predictions[basestationId];
    }
    return null;
  }

  nextFrame() {
    const frameLength = this.maxFrame.get();
    let frameNumber = (this.frameNumber.get() || 0) + 1;
    frameNumber = frameNumber % frameLength;
    this.setFrame(frameNumber);
  }

  setFrame(frameNumber: number) {
    this.frameNumber.set(frameNumber);
    this.save({ frameNumber: frameNumber });
  }

  setPref(key: string, value: any) {
    this.prefs[key] = value;
    this.save({ prefs: this.prefs });
  }

  setPrefs(prefs: SimPrefs) {
    this.save({ prefs: prefs });
  }

  setSessionPath(sessionPath: string) {
    this.sessionPath = sessionPath;
  }

  setSession(session: string) {
    this.firebaseImp.session = session;
  }

  renameSession(sessionName: string) {}
  copySession(oldName: string, newName: string) {
    this.firebaseImp.copySession(oldName, newName);
  }

  deleteSession(sessionName: string) {
    this.firebaseImp.removeSession(sessionName);
  }


  addMapConfig() {
    const map = new MapConfig();
    this.mapConfigMap[map.id] = map;
    this.editingMap = map;
    this.save({ mapConfigs: this.mapConfigMap });
  }

  saveMapConfig() {
    if (this.editingMap) {
      const key = `mapConfigs/${this.editingMap.id}`;
      this.saveToPath(key, this.editingMap);
    }
  }

  deleteMapConfig() {
    const mapConfig = this.editingMap;
    if (mapConfig) {
      delete this.mapConfigMap[mapConfig.id];
      this.editingMap = null;
      this.save({ mapConfigs: this.mapConfigMap });
    }
  }

  saveToPath(key: string, value: any) {
    const obj: any = {};
    obj[key] = value;
    this.firebaseImp.saveToFirebase(obj);
  }

  save(obj: any) {
    this.firebaseImp.saveToFirebase(obj);
  }

  unregisterFirebase() {
    this.firebaseImp.removeListener(this);
    console.log("firebase unregistered");
    return true;
  }
}

export const dataStore = new DataStore();
