import { types } from "mobx-state-tree";
import { SimulationSettings, ISimulationSettings } from "./simulation-settings";
import { WeatherScenario, IWeatherScenario } from "./weather-scenario";
import { WeatherStation } from "./weather-station";
import { PresenceStore } from "../stores/presence-store";
import { WeatherStationStore } from "../stores/weather-station-store";
import { PredictionStore } from "../stores/prediction-store";
import { v1 as uuid } from "uuid";

import * as moment from 'moment';

export const Simulation = types.model('Simulation', {
  name: types.string,
  id: types.optional(types.identifier(types.string), () => uuid()),
  scenario: types.reference(WeatherScenario),
  presences: PresenceStore,
  predictions: PredictionStore,
  stations: WeatherStationStore,
  isPlaying: types.boolean,
  simulationTime: types.maybe(types.Date),
  simulationSpeed: types.number,
  settings: SimulationSettings,
  get timeString() {
    // https://momentjs.com/
    return moment(this.simulationTime).format('lll');
  },
  get mapConfig() {
    return this.WeatherScenario.mapConfig;
  }
}, {
}, {
  play() {
    this.isPlaying = true;
  },
  stop() {
    this.isPlaying = false;
  },
  setPref(key: string, value: any) {
    this.settings.setSetting(key, value);
  },
  preProcessSnapshot(snapshot:any) {
    if (!!!snapshot.predictions) {
      snapshot.predictions = {predictions: []};
    }
    if (!!!snapshot.stations) {
      snapshot.stations = {stations:{}};
    }
    return snapshot;
  },
  // postProcessSnapshot(snapshot:any) {
  //   debugger;
  //   return snapshot;
  // }

});
export type ISimulation = typeof Simulation.Type;
