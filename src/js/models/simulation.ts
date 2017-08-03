import { types } from "mobx-state-tree";
import { SimulationSettings, ISimulationSettings } from './simulation';
import { WeatherScenario, IWeatherScenario } from './weather-scenario';


export const Simulation = types.model('Simulation', {
  scenario: types.reference(WeatherScenario),
  stations: types.array(tyes.reference(WeatherStation));
  stationStates: types.array(WeatherStationState),
  isPlaying: types.boolean;
  currentFrame: types.number;
  maxFrame: types.number;
  settings: SimulationSettings;
}, {

});
export type ISimulation = typeof Simulation.Type;
