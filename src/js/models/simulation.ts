import { types } from "mobx-state-tree";
import { SimulationSettings, ISimulationSettings } from "./simulation-settings";
import { WeatherScenario, IWeatherScenario } from "./weather-scenario";
import { WeatherStation } from "./weather-station";
import { PresenceStore } from "../stores/presence-store";
import { PredictionStore } from "../stores/prediction-store";
import * as moment from 'moment';

export const Simulation = types.model('Simulation', {
  name: types.string,
  id: types.string,
  scenario: types.reference(WeatherScenario),
  presences: PresenceStore,
  predictions: PredictionStore,
  stations: types.map(WeatherStation),
  isPlaying: types.boolean,
  simulationTime: types.Date,
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
  }
});
export type ISimulation = typeof Simulation.Type;
