import { types } from "mobx-state-tree";
import { SimulationSettings, ISimulationSettings } from './simulation';
import { WeatherScenario, IWeatherScenario } from './weather-scenario';


export const Simulation = types.model('Simulation', {
  scenario: types.reference(WeatherScenario),
  presences: presenceStore,
  weatherStations: weatherStationStore,
  predictions: predictionStore,
  stationStates: types.array(WeatherStationState),
  isPlaying: types.boolean;
  simulationTime: types.Date;
  simulationSpeed: types.number;
  settings: SimulationSettings;
}, {

});
export type ISimulation = typeof Simulation.Type;
