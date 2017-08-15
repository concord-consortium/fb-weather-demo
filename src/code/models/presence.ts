import { types } from "mobx-state-tree";
import { v1 as uuid } from "uuid";
import { IWeatherStation } from "./weather-station";
import { simulationStore } from "../stores/simulation-store";
import { IWeatherStationStore } from "../stores/weather-station-store";

export const presenceId = () => {
  const sessionID = localStorage.getItem("CCweatherSession") || uuid();
  localStorage.setItem("CCweatherSession", sessionID);
  return sessionID;
};

export const Presence = types.model("Presence",
{
  // properties
  id: types.optional(types.identifier(types.string), ()=> presenceId()),
  username: types.optional(types.string, () => "anonymous"),
  start: types.optional(types.Date, () => new Date()),
  weatherStationID: types.maybe(types.string),

  get weatherStation(): IWeatherStation | null {
    const stations: IWeatherStationStore | null = simulationStore.stations;
    return stations && stations.getStationByID(this.weatherStationID) || null;
  }
},{
  // volatile
},{
  // actions
  setUsername(name:string) {
    this.username = name;
  },
  setStation(station:IWeatherStation | null) {
    this.weatherStationID = station ? station.id : null;
  }
});

export type IPresence = typeof Presence.Type;
