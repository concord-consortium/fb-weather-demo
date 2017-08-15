import { types } from "mobx-state-tree";
import { v1 as uuid } from "uuid";
import { IWeatherStation, WeatherStation } from "./weather-station";
import { simulationStore } from "../stores/simulation-store";

export const presenceId = () => {
  const sessionID = localStorage.getItem("CCweatherSession") || uuid();
  localStorage.setItem("CCweatherSession", sessionID);
  return sessionID;
};

export const Presence = types.model("Presence",
{
  // properties
  username: types.optional(types.string, () => "anonymous"),
  id: types.optional(types.identifier(types.string), ()=> presenceId()),
  start: types.optional(types.Date, () => new Date()),
  weatherStation: types.maybe(types.reference(WeatherStation))
},{
  // volatile
},{
  // actions
  setUsername(name:string) {
    this.username = name;
  },
  setStation(station:IWeatherStation | null) {
    this.weatherStation = station;
  },

  // hooks
  preProcessSnapshot(snapshot: any) {
    const stations = simulationStore.stations,
          weatherStation = stations && stations.getStationByID(snapshot.weatherStation);
    if (stations && !weatherStation) {
      snapshot.weatherStation = null;
    }
    return snapshot;
  }
});

export type IPresence = typeof Presence.Type;
