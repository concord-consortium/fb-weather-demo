import { types } from "mobx-state-tree";
import { v1 as uuid } from "uuid";
import { IWeatherStation, WeatherStation } from "./weather-station";

export const presenceId = () => {
  const sessionID = localStorage.getItem("CCweatherSession") || uuid();
  localStorage.setItem("CCweatherSession", sessionID);
  return sessionID;
};

export const Presence = types.model("Presence",
{
  username: types.optional(types.string, () => "anonymous"),
  id: types.optional(types.identifier(types.string), ()=>uuid()),
  start: types.optional(types.Date, () => new Date()),
  weatherStation: types.maybe(types.reference(WeatherStation))
},{
  connectionStatus: null,
},{
  setUsername(name:string) {
    this.username = name;
  },
  setStation(station:IWeatherStation | null) {
    this.weatherStation = station;
  },
});

export type IPresence = typeof Presence.Type;
