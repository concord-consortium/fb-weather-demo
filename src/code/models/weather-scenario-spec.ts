import { weatherScenarioSpecs } from "../../json/weather-scenario-specs.json";
import { IWeatherScenarioSnapshot } from "./weather-scenario";

// preprocess scenarios, e.g. convert TimeSpecs to Dates
weatherScenarioSpecs.forEach((spec) => {
  let mod: IWeatherScenarioSnapshot = spec as any,
        s = spec.startTime,
        e = spec.endTime,
        endTime = e ? new Date(Date.UTC(e.year, e.month - 1, e.day, e.hour, e.minute)) : null;
  mod.startTime = s ? new Date(Date.UTC(s.year, s.month - 1, s.day, s.hour, s.minute)) : null;
  mod.duration = s && endTime && (endTime.getTime() - mod.startTime.getTime()) / 1000;
});

export const gWeatherScenarioSpec = weatherScenarioSpecs[0];

export interface ITimeSpec {
  year: number;
  month: number;
  day: number;
  hour?: number;
  minute?: number;
}

export interface IStationSpec {
  id: string;
  name: string;
  imageUrl: string;
}

export interface IMapConfigSpec {
    id: string;
    name: string;
    lat: number;
    long: number;
    zoom: number;
}

export type TWeatherScenarioSpecTempScale = "F" | "C";
export type TWeatherScenarioSpecTempBandModel = "three-bands" | "six-bands";

export interface IWeatherScenarioSpec {
  id: string;
  name: string;
  tempConfig: {
    eventScale: TWeatherScenarioSpecTempScale,
    displayScale: TWeatherScenarioSpecTempScale,
    bandModel: TWeatherScenarioSpecTempBandModel,
  };
  eventUrl: string;
  startTime?: ITimeSpec;
  endTime?: ITimeSpec;
  utcOffset?: number;
  stations?: IStationSpec[];
  mapConfig: IMapConfigSpec;
}
