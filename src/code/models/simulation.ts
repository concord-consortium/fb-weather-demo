import { types } from "mobx-state-tree";
import { SimulationControl } from "./simulation-control";
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
import { v1 as uuid } from "uuid";
import { gFirebase } from "../middleware/firebase-imp";

import * as _ from "lodash";
import * as moment from 'moment';

const kDefaultHalfTime = 0.75;

export const Simulation = types.model('Simulation', {
  name: types.optional(types.string,  () => "busted"),
  id: types.optional(types.identifier(types.string), () => uuid()),
  scenario: types.optional(WeatherScenario,      () => WeatherScenario.create(gWeatherScenarioSpec)),
  control: types.optional(SimulationControl,     () => SimulationControl.create()),
  settings: types.optional(SimulationSettings,   () => SimulationSettings.create()),
  presences: types.optional(PresenceStore,       () => PresenceStore.create()),
  predictions: types.optional(PredictionStore,   () => PredictionStore.create()),
  stations: types.optional(WeatherStationStore,  () => WeatherStationStore.create()),
  grid: types.optional(Grid,                     () => Grid.create()),
  groups: types.optional(GroupStore,             () => GroupStore.create()),

  get isPlaying(): boolean {
    return this.control.isPlaying;
  },
  get time(): Date {
    return this.control.time;
  },
  get startTime(): Date {
      return this.control.startTime;
  },
  get endTime(): Date {
    return this.scenario.endTime;
  },
  get halfTime(): Date {
    return this.control.halfTime;
  },
  get timeString(): string {
    return this.formatTime(this.time);
  },
  get mapConfig(): IMapConfig {
    return this.scenario && this.scenario.mapConfig;
  },
  get group(): IGroup {
    return this.groups.selected;
  },
  get selectedPresence(): IPresence | null {
    return this.presences.selected;
  },
  get groupName(): string {
    return this.presences.groupName;
  },
  get groupList(): IGroup[] | null {
    return this.groups && this.groups.groups;
  },
  get selectedGroup(): IGroup  | null {
    return this.groups && this.groups.getGroup(this.groupName);
  },
  get availableGroups() {
    const groupNames = this.presences.groupNames;
    const groupList = this.groupList;
    return _.filter(groupList, (g:IGroup) => {
      return !(_.includes(groupNames, g.name));
    });
  },
  formatTime(time: Date | null, format?: string): string {
    if (time == null) { return ""; }
    let m = moment(time);
    if (this.scenario.utcOffset) {
      m = m.utcOffset(this.scenario.utcOffset);
    }
    // formatting rules see: https://momentjs.com/
    return m.format(format || 'HH:mm' || 'lll');
  },

  // formats a local time, i.e. with local UTC offset
  formatLocalTime(time: Date | null, format?: string): string {
    return (this.settings && this.settings.formatLocalTime(time, format)) || "";
  },
  formatTemperature(temp: number | null, options: IFormatTempOptions): string {
    return this.settings ? this.settings.formatTemperature(temp, options) : "";
  },
  parseTemperature(temp: string): number | null {
    return this.settings && this.settings.parseTemperature(temp);
  },
  formatWindSpeed(windSpeed: number | null, options: IFormatWindSpeedOptions): string {
    return this.settings ? this.settings.formatWindSpeed(windSpeed, options) : "";
  },
  parseWindSpeed(windSpeed: string): number | null {
    return this.settings && this.settings.parseWindSpeed(windSpeed);
  },
  formatWindDirection(windSpeed: number | null, options: IFormatWindSpeedOptions): string {
    return this.settings ? this.settings.formatWindDirection(windSpeed, options) : "";
  },
  parseWindDirection(windDirection: string): number | null {
    return this.settings && this.settings.parseWindDirection(windDirection);
  },
  get selectedStation(): IWeatherStation | null {
    const stations = this.stations;
    return stations && stations.selected;
  },
  get presenceStation(): IWeatherStation | null {
    const selectedPresence = this.selectedPresence;
    return selectedPresence && selectedPresence.weatherStation;
  },
},{
  // volatile:
  isTeacherView: false,
}, {
  afterCreate() {
    if (_.size(this.stations.stations) === 0) {
      // create stations from scenario
      const stations = this.scenario.stations.map((spec: IStationSpec) => {
                          return WeatherStation.create({
                                    name: spec.name,
                                    imageUrl: spec.imageUrl,
                                    id: uuid(),
                                    callSign: spec.id
                                  });
                        });
      this.stations.addStations(stations);
    }
    // create any missing stations … not included with scenario
    this.grid.createCells(this.stations);
    this.createGroups();
    // initialize stations from WeatherEvent
    this.stations.stations.forEach((station: IWeatherStation) => {
      gWeatherEvent.stationData(station.callSign)
        .then((stationData: any) => {
          if ((station.lat == null) || (station.long == null)) {
            station.setLocation({ lat: stationData.lat, long: stationData.long });
          }

          const startTime = this.scenario.startTime || gWeatherEvent.startTime;
          if (!this.control.startTime) {
            this.control.setStartTime(startTime);
            this.setHalfTime(kDefaultHalfTime);
          }
          if (!this.time) {
            this.setTime(startTime);
          }
          station.setState(new WeatherStationState(stationData, this.control, this.settings.interpolationEnabled));
        })
        .catch((err: any) => {
          console.log(`Error initializing weather station '${station.id}': ${err}`);
        });
    });
  },
  filterOutboundData(snapshot:any) {
    let copy = _.cloneDeep(snapshot);
    const studentRemoveKeys = ["control", "presences", "settings"];
    const teacherRemoveKeys = ["presences"];
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
    // remove the control tree from student snapshot
    // to prevent the replay of timestamp changes.
    const keysToRemove = this.isTeacherView ? teacherRemoveKeys : studentRemoveKeys;
    remove(copy, keysToRemove);
    return copy;
  },
  outboundPresence(snapshot:any) {
    const presences = snapshot && snapshot.presences && snapshot.presences.presences,
          selectedPresence = this.selectedPresence,
          selectedPresenceID = selectedPresence && selectedPresence.id;
    return presences && selectedPresenceID && presences[selectedPresenceID];
  },
  setIsTeacherView(teachermode:boolean) {
    const presence: IPresence | null = this.selectedPresence;
    this.isTeacherView = teachermode;
    if (presence) {
      presence.setRole(teachermode ? ERole.teacher : ERole.student);
    }
  },
  initPresence() {
    const self = this;
    const firebase = gFirebase;
    gFirebase.postConnect.then( () => {
      const id = firebase.user.uid;
      if(self.presences.selected && self.presences.selected.id === id) {
        return;
      }
      const path =`simulations/${self.id}`;
      const snapshot = { id, role: self.isTeacherView ? ERole.teacher : ERole.student };
      self.presences.createPresence(path, snapshot);
    });
  },
  createGroups() {
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
    this.groups.addGroups(groupNames);
  },
  // SimulationControl wrappers
  setTime(time: Date) {
    this.control.setTime(time);
  },

  proportionalTime(portion:number) {
    const max = this.scenario.endTime && this.scenario.endTime.getTime();
    const min = this.scenario.startTime && this.scenario.startTime.getTime();
    const rangeMSeconds = max - min;
    const adjustmentSeconds = rangeMSeconds * portion;
    return new Date(min + adjustmentSeconds);
  },

  setProportionalTime(portion:number) {
    this.control.setTime(this.proportionalTime(portion));
  },
  setHalfTime(portion: number) {
    this.control.setHalfTime(this.proportionalTime(portion));
  },
  rewind() {
    this.control.rewind();
  },
  playFirstHalf() {
    this.control.playFirstHalf();
  },
  playSecondHalf() {
    this.control.playSecondHalf();
  },
  play() {
    this.control.play();
  },
  stop() {
    this.control.stop();
  },
  stepForward() {
    this.control.stepForward();
  },
  stepBack() {
    this.control.stepBack();
  }
});

export type ISimulation = typeof Simulation.Type;


const SimulationStore = types.model(
  {
    simulationsMap: types.optional(types.map(Simulation), {})
  },
  {
    selected: () => Simulation.create({id:"fake", name:"fake"})
  },
  {
    add(name:string) {
      const newSimulation = Simulation.create({name:name, id:name});
      this.simulationsMap.put(newSimulation);
      return newSimulation;
    },
    get(name:string):ISimulation | undefined {
      return this.simulationsMap.get(name);
    },
    select(name:string){
      this.selected = this.get(name) || this.add(name);
      Firebasify(this.selected, `simulations/${name}`, () => {
        this.selected.initPresence();
      });
      return this.selected;
    }
  });

export const simulationStore  = SimulationStore.create();
