import { observable, computed } from "mobx";
import { v1 as uuid } from "uuid";
import { Basestation, BasestationMap } from "./basestation";
import { SimPrefs } from "./sim-prefs";
import { FirebaseImp } from "./firebase-imp";
import { FrameHelper } from "./frame-helper";
import { Presence, PresenceMap } from "./presence";
import { MapConfig, MapConfigMap } from "./map-config";

const _ = require("lodash");
const CsvParse = require("csv-parse/lib/sync");

type NowShowingType =
  | "loading"
  | "choose"
  | "teacher"
  | "student"
  | "classroom"
  | "setup";

type CsvRecord = {
  [key: string]: string | number | null;
};

type CsvRecords = CsvRecord[];

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
  presence?: PresenceMap;
  basestations?: BasestationMap;
  mapConfigs?: MapConfigMap;
}

class DataStore {
  @observable nowShowing: NowShowingType;
  @observable frameNumber: number;
  @observable maxFrame: number;
  @observable prefs: SimPrefs;
  @observable predictions: PredictionMap;
  @observable presenceMap: PresenceMap;
  @observable basestationMap: BasestationMap;
  @observable mapConfigMap: MapConfigMap;
  @observable editingMap: MapConfig | null;
  @observable sessionList: string[];
  @observable sessionPath: string;
  firebaseImp: FirebaseImp;

  constructor() {
    this.nowShowing = "loading";
    this.frameNumber = 0;
    this.prefs = {
      showBaseMap: true,
      showTempColors: false,
      showTempValues: false,
      showDeltaTemp: false,
      showStationNames: false,
      enablePrediction: false,
      showPredictions: false
    };
    this.presenceMap = {};
    this.predictions = {};
    this.basestationMap = {};
    this.mapConfigMap = {};
    this.sessionList = [];
    this.registerFirebase();
  }

  registerFirebase() {
    this.firebaseImp = new FirebaseImp();
    this.firebaseImp.addListener(this);
    this.setNowShowing("loading");
    this.firebaseImp.initFirebase(() => {
      // TBD: Initialize an empty instance
    });
  }

  setNowShowing(_new: NowShowingType) {
    this.nowShowing = _new;
  }

  setSessionList(newSessions: string[]) {
    this.sessionList = observable(newSessions);
  }

  setState(newState: FireBaseState) {
    if (newState.frameNumber) {
      this.frameNumber = newState.frameNumber;
    }

    if (newState.maxFrame) {
      this.maxFrame = newState.maxFrame;
    }

    if (newState.prefs) {
      this.prefs = observable(newState.prefs);
    } else {
      this.setPrefs(new SimPrefs());
    }

    if (newState.predictions) {
      this.predictions = observable(newState.predictions);
    } else {
      this.predictions = observable({});
    }

    if (newState.presence) {
      this.presenceMap = observable(newState.presence);
    } else {
      this.presenceMap = observable({});
    }

    if (newState.basestations) {
      this.basestationMap = observable(newState.basestations);
    } else {
      this.basestationMap = observable({});
    }

    if (newState.mapConfigs) {
      this.mapConfigMap = observable(newState.mapConfigs);
    } else {
      this.mapConfigMap = observable({});
    }
  }

  @computed
  get prediction(): Prediction {
    const defaultPrediction = {
      temp: 32,
      rationale: "(no rationale)",
      imageUrl: ""
    };
    if (this.basestation) {
      const uuid = this.basestation.id;
      return this.predictions[uuid] || defaultPrediction;
    }
    return defaultPrediction;
  }

  @computed
  get userInfo() {
    const uuid = this.firebaseImp.sessionID;
    const defaultPresence = {
      name: "",
      id: "",
      baseStationId: "none"
    };
    return this.presenceMap[uuid] || observable(defaultPresence);
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
  get basestation() {
    return this.basestationMap[this.userInfo.basestationId];
  }

  @computed
  get filteredPredictions() {
    const predictionKeys = _.keys(this.predictions);
    const presenceKeys = _.keys(this.presenceMap);
    const results: Prediction[] = [];
    for (let i = 0; i < presenceKeys.length; i++) {
      let key = presenceKeys[i];
      let presence = this.presenceMap[key];
      let basestation = this.basestationMap[presence.basestationId];
      if (basestation) {
        if (_.includes(predictionKeys, key)) {
          let prediction = this.predictions[key];
          results.push({
            name: basestation.name,
            temp: prediction.temp,
            rationale: prediction.rationale
          });
        }
      }
    }
    return results;
  }

  @computed
  get temp() {
    if (this.basestation && this.basestation.data) {
      if (this.basestation.data[this.frameNumber]) {
        return this.basestation.data[this.frameNumber].value;
      }
    }
    return 0;
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

  set userInfo(baseChange: Presence) {
    const uuid = this.firebaseImp.sessionID;
    _.assignIn(this.presenceMap[uuid], baseChange);
    this.firebaseImp.saveUserData(this.presenceMap[uuid]);
  }

  predictionFor(basestationId: string):Prediction | null{
    if (this.predictions[basestationId] !== undefined) {
      return this.predictions[basestationId];
    }
    return null;
  }

  updateUserPref(key: any, value: any) {
    const uuid = this.firebaseImp.sessionID;
    const prefs = this.presenceMap[uuid] as any;
    prefs[key] = value;
    this.firebaseImp.saveUserData(prefs);
  }

  setUserBaseStation(id: string) {
    this.updateUserPref("basestationId", id);
  }

  nextFrame() {
    const frameLength = this.maxFrame;
    let frameNumber = (this.frameNumber || 0) + 1;
    frameNumber = frameNumber % frameLength;
    this.setFrame(frameNumber);
  }

  setFrame(frame: number) {
    this.frameNumber = frame;
    this.save({ frame: frame });
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

  setPrediction(prediction: Prediction) {
    if (this.basestation) {
      const uuid = this.basestation.id;
      this.predictions[uuid] = prediction;
      this.save({ predictions: this.predictions });
    }
  }

  addBasestation() {
    const bs = new Basestation();
    this.basestationMap[bs.id] = bs;
    this.save({ basestations: this.basestationMap });
  }

  addBasestationData(data: string) {
    const records = CsvParse(data, { auto_parse: true, columns: true });
    if (records && this.basestation) {
      const timeSlice = 1000 * 60 * 60;
      const grouped = _.groupBy(records, (item: CsvRecord) => {
        return Math.floor(Date.parse(item.DATE as string) / timeSlice);
      });
      const frames = _.map(records, (item: CsvRecord) => {
        const time =
          Math.floor(Date.parse(item.time as string) / timeSlice) * timeSlice;
        return { time: time, value: item.air_temperature };
      });
      this.basestation.data = frames;
      const key = `basestations/${this.basestation.id}/data`;
      this.saveToPath(key, this.basestation.data);
    } else {
      console.error("Could not load data in frame-helper");
    }
  }

  updateBasestation(data: Basestation) {
    const key = `basestations/${this.basestation.id}`;
    this.basestationMap[this.basestation.id] = data;
    this.saveToPath(key, data);
  }

  saveBasestation() {
    if (this.basestation) {
      const key = `basestations/${this.basestation.id}`;
      this.saveToPath(key, this.basestation);
    }
  }

  deleteBasestation(base: Basestation | null) {
    if (base) {
      delete this.basestationMap[base.id];
      this.save({ basestations: this.basestationMap });
    }
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
