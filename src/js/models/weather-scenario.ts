import { types } from "mobx-state-tree";


export const WeatherScenario = types.model('WeatherScenario', {
  eventUrl: types.string;
  stationIDs: types.array(types.string);
  mapConfig: MapConfig;
  startTime: types.Date;
  endTime: types.Date;
}, {

});
export type IWeatherScenario = typeof WeatherScenario.Type;
