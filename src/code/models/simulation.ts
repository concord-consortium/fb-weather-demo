import { types } from "mobx-state-tree";
import { SimulationControl } from "./simulation-control";
import { SimulationSettings } from "./simulation-settings";
import { IMapConfig } from "./map-config";
import { gWeatherEvent } from "./weather-event";
import { WeatherScenario, IStationSpec } from "./weather-scenario";
import { gWeatherScenarioSpec } from "./weather-scenario-spec";
import { WeatherStation, IWeatherStation } from "./weather-station";
import { WeatherStationState } from "./weather-station-state";
import { PresenceStore } from "../stores/presence-store";
import { WeatherStationStore } from "../stores/weather-station-store";
import { PredictionStore } from "../stores/prediction-store";
import { GroupStore } from "../stores/group-store";
import { Grid } from "./grid";
import { IGroup } from "./group";
import { v1 as uuid } from "uuid";

import * as _ from "lodash";
import * as moment from 'moment';

export const Simulation = types.model('Simulation', {
  name: types.string,
  id: types.optional(types.identifier(types.string), () => uuid()),
  scenario: types.optional(WeatherScenario,     () => WeatherScenario.create(gWeatherScenarioSpec)),
  control: types.optional(SimulationControl,    () => SimulationControl.create()),
  settings: types.optional(SimulationSettings,  () => SimulationSettings.create()),
  presences: types.optional(PresenceStore,      () => PresenceStore.create()),
  predictions: types.optional(PredictionStore,  () => PredictionStore.create()),
  stations: types.optional(WeatherStationStore, () => WeatherStationStore.create()),
  grid: types.optional(Grid,                    () => Grid.create()),
  groups: types.optional(GroupStore,            () => GroupStore.create()),

  get isPlaying(): boolean {
    return this.control.isPlaying;
  },
  get time(): Date {
    return this.control.time;
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
  get groupName(): string {
    if(this.group) {
      return this.group.name;
    }
    return "";
  },
  formatTime(time: Date | null, format?: string): string {
    if (time == null) { return ""; }
    let m = moment(time);
    if (this.scenario.utcOffset) {
      m = m.utcOffset(this.scenario.utcOffset);
    }
    // formatting rules see: https://momentjs.com/
    return m.format(format || 'lll');
  }
}, {
}, {
  afterCreate() {
    this.presences.initPresence();
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
          }
          if (!this.time) {
            this.setTime(startTime);
          }
          station.setState(new WeatherStationState(stationData, this.control));
        })
        .catch((err: any) => {
          console.log(`Error initializing weather station '${station.id}': ${err}`);
        });
    });

  },

  createGroups() {
    const groupNames = [
      "stallions",
      "pumas",
      "otters",
      "lizards",
      "moles",
      "raccoons",
      "alligators",
      "goats",
      "lambs"
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
  setHalfTime() {
    this.control.setHalfTime();
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
