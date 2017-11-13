const weatherScenarioSpecs = require("../../json/weather-scenario-specs.json") || [];

// preprocess scenarios, e.g. convert TimeSpecs to Dates
weatherScenarioSpecs.forEach((spec: IWeatherScenarioSpec) => {
  const mod = spec as any,
        s = spec.startTime,
        e = spec.endTime;
  mod.startTime = s ? new Date(Date.UTC(s.year, s.month - 1, s.day, s.hour, s.minute)) : null;
  mod.endTime = e ? new Date(Date.UTC(e.year, e.month - 1, e.day, e.hour, e.minute)) : null;
});

export const gWeatherScenarioSpec: IWeatherScenarioSpec =
              weatherScenarioSpecs && weatherScenarioSpecs.length && weatherScenarioSpecs[0];

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
  eventUrl: string;
  startTime?: ITimeSpec;
  endTime?: ITimeSpec;
  utcOffset?: number;
  stations?: IStationSpec[];
  mapConfig: IMapConfigSpec;
}
