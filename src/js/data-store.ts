import { observable, computed, IObservableValue } from "mobx";
import { applySnapshot, getSnapshot } from "mobx-state-tree";
import { Basestation, BasestationMap } from "./basestation";
import { gFirebase } from "./firebase-imp";
import { MapConfig, IMapConfig, MapConfigMap } from "./models/map-config";
import { SimulationSettings, ISimulationSettings } from "./models/simulation-settings";
import { SimulationControl, ISimulationControl } from "./models/simulation-control";
/* test code for WeatherEvent, WeatherStationState
import { gWeatherEvent } from "./models/weather-event";
import { WeatherStationState } from "./models/weather-station-state";
*/

const _ = require("lodash");

export interface FireBaseState {
  frameNumber?: number;
  maxFrame: number;
  prefs?: ISimulationSettings;
  basestations?: BasestationMap;
  mapConfigs?: MapConfigMap;
}

class DataStore {
  @observable simulationControl: ISimulationControl;
  @observable frameNumber: IObservableValue<number>;
  @observable maxFrame: IObservableValue<number>;
  @observable prefs: ISimulationSettings;
  @observable basestationMap: BasestationMap;
  @observable mapConfigMap: MapConfigMap;
  @observable editingMap: IMapConfig | null;
  @observable sessionList: string[];
  @observable sessionPath: string;

  constructor() {
    this.simulationControl = SimulationControl.create();
    this.frameNumber = observable(0);
    this.maxFrame = observable(0);
    this.prefs = SimulationSettings.create();
    this.basestationMap = observable({} as BasestationMap);
    this.mapConfigMap = {};
    this.sessionList = [];

    gFirebase.addListener(this);

    /* Test code for WeatherEvent, WeatherStationData
    gWeatherEvent.stationData('KASW')
      .then((stationData: any) => {
        if (stationData) {
          const count = stationData.rows && stationData.rows.length;
          console.log(`${stationData.id}: loaded ${count} records`);
          let state = new WeatherStationState(stationData, this.simulationControl);
          console.log(`Temperature[0] = ${state.temperature}`);
          this.simulationControl.setTime(gWeatherEvent.startTime);
          console.log(`Temperature[1] = ${state.temperature}`);
          this.simulationControl.advanceTime({ minutes: 10 });
          console.log(`Temperature[2] = ${state.temperature}`);
          this.simulationControl.advanceTime({ hours: 6 });
          console.log(`Temperature[3] = ${state.temperature}`);
        }
      })
      .catch((err: any) => {
        console.log(`KASW: No station data received: "${err}"`);
      });
    */
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
      applySnapshot(this.prefs, newState.prefs);
    }
    else {
      this.prefs = SimulationSettings.create();
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
    return _.map(this.mapConfigMap, (g: IMapConfig) => {
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
    this.prefs.setSetting(key, value);
    this.save({ prefs: getSnapshot(this.prefs) });
  }

  setPrefs(prefs: ISimulationSettings) {
    this.save({ prefs: getSnapshot(prefs) });
  }

  setSessionPath(sessionPath: string) {
    this.sessionPath = sessionPath;
  }

  setSession(session: string) {
    gFirebase.session = session;
  }

  renameSession(sessionName: string) {}
  copySession(oldName: string, newName: string) {
    gFirebase.copySession(oldName, newName);
  }

  deleteSession(sessionName: string) {
    gFirebase.removeSession(sessionName);
  }


  addMapConfig() {
    const map = MapConfig.create();
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
    gFirebase.saveToFirebase(obj);
  }

  save(obj: any) {
    gFirebase.saveToFirebase(obj);
  }

  unregisterFirebase() {
    gFirebase.removeListener(this);
    console.log("firebase unregistered");
    return true;
  }
}

export const dataStore = new DataStore();
