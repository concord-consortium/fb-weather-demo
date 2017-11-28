import { types } from "mobx-state-tree";
import { v1 as uuid } from "uuid";
import { IWeatherStation } from "./weather-station";
import { simulationStore } from "../models/simulation";
import { IWeatherStationStore } from "../stores/weather-station-store";
import { IGroup } from "./group";

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
  start: types.optional(types.string, () => new Date().toISOString()),
  weatherStationID: types.maybe(types.string),
  groupName: types.maybe(types.string),
  get weatherStation(): IWeatherStation | null {
    const stations: IWeatherStationStore | null = simulationStore.stations;
    return stations && stations.getStationByID(this.weatherStationID) || null;
  },
  get group(): IGroup | null {
    const groups = simulationStore.groups;
    return groups && groups.getGroup(this.groupName) || null;
  }
},{
  // volatile
},{
  // actions
  setUsername(name:string) {
    this.username = name;
  },
  setGroupName(name:string) {
    this.groupName = name;
  },
  setStation(station:IWeatherStation | null) {
    this.weatherStationID = station ? station.id : null;
  },
  setStationId(id:string) {
    this.weatherStationID = id;
  },
  updateTime() {
    this.start = new Date().toISOString();
  }
});

export type IPresence = typeof Presence.Type;
