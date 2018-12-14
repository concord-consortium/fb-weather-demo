import { weatherScenarioSpecs } from "../../json/weather-scenario-specs.json";
import { IWeatherScenarioSnapshot } from "./weather-scenario";
import { TemperatureUnit } from "./temperature";
import { urlParams } from "../utilities/url-params";

// preprocess scenarios, e.g. convert TimeSpecs to Dates
weatherScenarioSpecs.forEach((spec) => {
  let mod: IWeatherScenarioSnapshot = spec as any,
        s = spec.startTime,
        e = spec.endTime,
        endTime = e ? new Date(Date.UTC(e.year, e.month - 1, e.day, e.hour, e.minute)) : null;
  mod.startTime = s ? new Date(Date.UTC(s.year, s.month - 1, s.day, s.hour, s.minute)) : null;
  mod.duration = s && endTime && (endTime.getTime() - mod.startTime.getTime()) / 1000;
});

let scenarioIndex = 0;
if (urlParams.scenario) {
  scenarioIndex = Math.max(0, weatherScenarioSpecs.findIndex((spec) => spec.id === urlParams.scenario));
}
export const gWeatherScenarioSpec = weatherScenarioSpecs[scenarioIndex];
console.log(`Using scenario ${gWeatherScenarioSpec.id}`);

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

export interface IWeatherScenarioSpec {
  id: string;
  name: string;
  tempConfig: {
    eventUnit: TemperatureUnit,
    bandModel: "three-bands" | "six-bands",
  };
  eventUrl: string;
  startTime?: ITimeSpec;
  endTime?: ITimeSpec;
  utcOffset?: number;
  stations?: IStationSpec[];
  mapConfig: IMapConfigSpec;
}
