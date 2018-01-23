import { types } from "mobx-state-tree";
import { MapConfig } from "./map-config";

export const StationSpec = types.model({
  id: types.identifier(types.string),
  name: types.string,
  imageUrl: types.string
});
export type IStationSpec = typeof StationSpec.Type;

export const WeatherScenario = types.model('WeatherScenario', {
  id: types.identifier(types.string),
  name: types.string,
  eventUrl: types.string,
  startTime: types.maybe(types.Date),   // UTC Date
  duration: types.maybe(types.number),  // seconds
  utcOffset: types.maybe(types.number),
  stations: types.maybe(types.array(StationSpec)),
  mapConfig: MapConfig
}, {
  // volatile
}, {
});
export type IWeatherScenario = typeof WeatherScenario.Type;
export type IWeatherScenarioSnapshot = typeof WeatherScenario.SnapshotType;
