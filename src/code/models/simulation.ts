import { types, onSnapshot } from "mobx-state-tree";
import { SimulationControl } from "./simulation-control";
import { SimulationMetadata, gSimulationMetadata } from "./simulation-metadata";
import { SimulationSettings, IFormatTempOptions, IFormatWindSpeedOptions } from "../models/simulation-settings";
import { IMapConfig } from "./map-config";
import { gWeatherEvent } from "./weather-event";
import { WeatherScenario, IStationSpec } from "./weather-scenario";
import { gWeatherScenarioSpec } from "./weather-scenario-spec";
import { WeatherStation, IWeatherStation } from "./weather-station";
import { WeatherStationState } from "./weather-station-state";
import { WeatherStationStore } from "../stores/weather-station-store";
import { PredictionStore } from "../stores/prediction-store";
import { GroupStore } from "../stores/group-store";
import { Grid } from "./grid";
import { IGroup } from "./group";
import { ERole, IPresence } from "./presence";
import { PresenceStore} from "../stores/presence-store";
import { Firebasify } from "../middleware/firebase-decorator";
import { v4 as uuid } from "uuid";
import { gFirebase } from "../middleware/firebase-imp";

import * as _ from "lodash";
import * as moment from 'moment';

// from https://gist.github.com/Yimiprod/7ee176597fef230d1451
const difference = (object: any, base: any) => {
  const changes = (object: any, base: any) => {
    return _.transform(object, (result, value, key) => {
      if (!_.isEqual(value, base[key])) {
        result[key] = (_.isObject(value) && _.isObject(base[key])) ? changes(value, base[key]) : value;
      }
    });
  };
  return changes(object, base);
};

const kBreakProportion = 0.66666666666666666667; // use 0.75 for 4pm;

export const Simulation = types
  .model('Simulation', {
    name: types.optional(types.string,  () => "shall-not-be-named"),
    id: types.optional(types.identifier(types.string), () => uuid()),
    metadata: types.optional(SimulationMetadata,   () => SimulationMetadata.create(gSimulationMetadata)),
    scenario: types.optional(WeatherScenario,      () => WeatherScenario.create(gWeatherScenarioSpec)),
    control: types.optional(SimulationControl,     () => SimulationControl.create()),
    settings: types.optional(SimulationSettings,   () => SimulationSettings.create()),
    presences: types.optional(PresenceStore,       () => PresenceStore.create()),
    predictions: types.optional(PredictionStore,   () => PredictionStore.create()),
    stations: types.optional(WeatherStationStore,  () => WeatherStationStore.create()),
    grid: types.optional(Grid,                     () => Grid.create()),
    groups: types.optional(GroupStore,             () => GroupStore.create())
  })
  .volatile(self => ({
    isTeacherView: false,
    presenceID: null as (string | null),
    lastFilteredOutbound: null as (any | null)
  }))
  .views(self => ({
    get displayName(): string {
      const parts = self.name.split("_");
      return parts.length > 1 ? parts[1] : self.name;
    },
    get isPlaying(): boolean {
      return self.control.isPlaying;
    },
    get time(): Date | null {
      return self.control.time;
    },
    get startTime(): Date | null {
      return self.control.startTime;
    },
    get breakTime(): Date | null {
      return self.control.breakTime;
    },
    get endTime(): Date | null {
      return self.control.endTime;
    },
    formatTime(time: Date | null, format?: string): string {
      if (time == null) { return ""; }
      let m = moment.utc(time);
      if (self.scenario.utcOffset) {
        m = m.utcOffset(self.scenario.utcOffset);
      }
      // formatting rules see: https://momentjs.com/
      return m.format(format || 'h:mm A' || 'lll');
    }
  }))
  .views(self => ({
    get timeString(): string {
      return self.formatTime(self.time);
    },
    get mapConfig(): IMapConfig {
      return self.scenario && self.scenario.mapConfig;
    },
    // the group selected in the store
    get group(): IGroup | null {
      return self.groups.selectedGroup || null;
    },
    get selectedPresence(): IPresence | null {
      return self.presences.selected || null;
    },
    get groupName(): string {
      return self.presences.groupName;
    },
    get groupList(): IGroup[] | null {
      return self.groups && self.groups.groups;
    },
    get selectedGroup(): IGroup | null {
      return self.groups && self.groups.getGroup(self.presences.groupName) || null;
    },
    get availableGroups() {
      const groupNames = self.presences.groupNames;
      const groupList = self.groups && self.groups.groups;
      return _.filter(groupList, (g:IGroup) => {
        return !(_.includes(groupNames, g.name));
      });
    },

    // formats a local time, i.e. with local UTC offset
    formatLocalTime(time: Date | null, format?: string): string {
      return (self.settings && self.settings.formatLocalTime(time, format)) || "";
    },
    formatTemperature(temp: number | null, options: IFormatTempOptions): string {
      return self.settings && (temp != null) ? self.settings.formatTemperature(temp, options) : "";
    },
    parseTemperature(temp: string): number | null {
      return self.settings && self.settings.parseTemperature(temp);
    },
    formatWindSpeed(windSpeed: number | null, options: IFormatWindSpeedOptions): string {
      return self.settings && (windSpeed != null) ? self.settings.formatWindSpeed(windSpeed, options) : "";
    },
    parseWindSpeed(windSpeed: string): number | null {
      return self.settings && self.settings.parseWindSpeed(windSpeed);
    },
    formatWindDirection(windSpeed: number | null, options: IFormatWindSpeedOptions): string {
      return self.settings && (windSpeed != null) ? self.settings.formatWindDirection(windSpeed, options) : "";
    },
    parseWindDirection(windDirection: string): number | null {
      return self.settings && self.settings.parseWindDirection(windDirection);
    },
    get selectedStation(): IWeatherStation | null {
      const stations = self.stations;
      return stations && stations.selected;
    },
    get presenceStation(): IWeatherStation | null {
      const selectedPresence = self.presences.selected;
      return selectedPresence && selectedPresence.weatherStation || null;
    },
    get updateInterval() {
      return self.control.updateInterval;
    },
    setUpdateInterval(updateInterval: number) {
      self.control.setUpdateInterval(updateInterval);
    },
  }))
  .actions(self => ({
    setPresenceID(presenceID: string | null) {
      self.presenceID = presenceID;
    }
  }))
  .actions(self => {

    function _createGroups() {
      const groupNames = [
        "Group 1",
        "Group 2",
        "Group 3",
        "Group 4",
        "Group 5",
        "Group 6",
        "Group 7",
        "Group 8",
        "Group 9"
      ];
      self.groups.addGroups(groupNames);
    }

    return {
      afterCreate() {
        onSnapshot(self, (snapshot: ISimulationSnapshot) => {
          // check whether our presence has been cleared (e.g. remotely by teacher)
          if (self.presenceID && (snapshot.presences.presences[self.presenceID] == null)) {
            // disconnect from firebase
            gFirebase.signOut();
            // clear our cached presence ID
            self.setPresenceID(null);
          }
        });
        if (_.size(self.stations.stations) === 0) {
          // create stations from scenario
          const stations = self.scenario.stations &&
                            self.scenario.stations.map((spec: IStationSpec) => {
                              return WeatherStation.create({
                                        name: spec.name,
                                        imageUrl: spec.imageUrl,
                                        id: uuid(),
                                        callSign: spec.id
                                      });
                            });
          self.stations.addStations(stations || []);
        }
        // create any missing stations … not included with scenario
        self.grid.createCells(self.stations);
        _createGroups();
        // initialize stations from WeatherEvent
        self.stations.stations.forEach((station: IWeatherStation) => {
          gWeatherEvent.stationData(station.callSign)
            .then((stationData: any) => {
              if ((station.lat == null) || (station.long == null)) {
                station.setLocation({ lat: stationData.lat, long: stationData.long });
              }

              const startTime = self.scenario.startTime || gWeatherEvent.startTime,
                    duration = self.scenario.duration || gWeatherEvent.duration;
              if (!self.control.startTime) {
                self.control.setTimeRange(startTime, duration, kBreakProportion);
              }
              if (!self.time) {
                self.control.setTime(startTime);
              }
              station.setState(new WeatherStationState(stationData, self.control, self.settings.interpolationEnabled, self.scenario.tempConfig));
            })
            .catch((err: any) => {
              console.log(`Error initializing weather station '${station.id}': ${err}`);
            });
        });
      },

      filterOutboundData(snapshot:any) {
        // only send outbound data if its a teacher, students set their presence seperately
        if (!self.isTeacherView) {
          return {
            data: {},
            update: false,
            individualKeys: false
          };
        }
        let setIndividualKeys = false;
        let copy = _.cloneDeep(snapshot);
        const keysToRemove = ["presences", "predictions"];
        // remove keys from object.
        const remove = (obj:any, keys:string[]) => {
          let key;
          for (key in obj) {
            if(_.includes(keys,key)){
              delete obj[key];
            }
            else if (typeof obj === "object") {
              remove(obj[key], keys);
            }
          }
        };
        remove(copy, keysToRemove);
        if (self.isPlaying && self.lastFilteredOutbound) {
          const diff: any = difference(copy, self.lastFilteredOutbound);
          const numKeys = Object.keys(diff).length;
          setIndividualKeys = (numKeys === 0) || ((numKeys === 1) && diff.control);
          self.lastFilteredOutbound = copy;
          if (setIndividualKeys) {
            copy = diff;
          }
        }
        else {
          self.lastFilteredOutbound = copy;
        }
        return {
          data: copy,
          update: true,
          individualKeys: setIndividualKeys
        };
      },
      outboundPresence(snapshot:any) {
        const presences = snapshot && snapshot.presences && snapshot.presences.presences,
              selectedPresence = self.selectedPresence,
              selectedPresenceID = selectedPresence && selectedPresence.id;
        return presences && selectedPresenceID && presences[selectedPresenceID];
      },
      setIsTeacherView(teachermode:boolean) {
        const presence: IPresence | null = self.selectedPresence;
        self.isTeacherView = teachermode;
        if (presence) {
          presence.setRole(teachermode ? ERole.teacher : ERole.student);
        }
      },
      initPresence() {
        const firebase = gFirebase;
        gFirebase.postConnect.then( () => {
          const id = firebase.user && firebase.user.uid;
          if(!id || self.presences.selected && self.presences.selected.id === id) {
            return;
          }
          const path =`simulations/${self.id}`;
          const snapshot = { id, role: self.isTeacherView ? ERole.teacher : ERole.student };
          self.presences.createPresence(path, snapshot);
          // cache our presence ID
          self.setPresenceID(id);
        });
      },
      deletePresence(presenceID: string) {
        const path =`simulations/${self.id}`;
        self.presences.deletePresence(path, presenceID);
      },
      deleteAllOtherPresences() {
        const path =`simulations/${self.id}`;
        self.presences.deleteAllOtherPresences(path);
      },
      // SimulationControl wrappers
      setTime(time: Date) {
        self.control.setTime(time);
      },
      rewind() {
        self.control.rewind();
      },
      play() {
        self.control.play();
      },
      stop() {
        self.control.stop();
      },
      stepForward() {
        self.control.stepForward();
      },
      stepBack() {
        self.control.stepBack();
      }
    };
  });
export type ISimulation = typeof Simulation.Type;
export type ISimulationSnapshot = typeof Simulation.SnapshotType;

const SimulationStore = types
  .model('SimulationStore', {
    simulationsMap: types.optional(types.map(Simulation), {})
  })
  .volatile(self => ({
    selected: null as (ISimulation | null)
  }))
  .views(self => ({
    get(name:string): ISimulation | undefined {
      return self.simulationsMap.get(name);
    },
  }))
  .actions(self => ({
    add(name:string) {
      const newSimulation = Simulation.create({name:name, id:name});
      self.simulationsMap.put(newSimulation);
      return newSimulation;
    }
  }))
  .actions(self => ({
    select(name:string) {
      const simulation = self.get(name) || self.add(name);
      if (simulation) {
        self.selected = simulation;
        Firebasify(self.selected, `simulations/${name}`, () => {
          simulation.initPresence();
        });
      }
      return simulation;
    }
  }));
export const simulationStore = SimulationStore.create();
