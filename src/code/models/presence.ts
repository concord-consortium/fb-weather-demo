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

export enum ERole {
  teacher = 'teacher',
  student = 'student'
}

export const Presence = types.model("Presence",
{
  // properties
  id: types.optional(types.identifier(types.string), ()=> presenceId()),
  username: types.optional(types.string, () => "anonymous"),
  role: types.optional(types.enumeration('Role', [ERole.teacher, ERole.student]), ERole.student),
  // code allows switching pages/roles currently - track whether we've ever been a teacher
  wasTeacher: types.optional(types.boolean, false),
  start: types.optional(types.string, () => new Date().toISOString()),
  weatherStationID: types.maybe(types.string),
  groupName: types.maybe(types.string),
  get weatherStation(): IWeatherStation | null {
    const stations: IWeatherStationStore | null = simulationStore.selected.stations;
    return stations && stations.getStationByID(this.weatherStationID) || null;
  },
  get group(): IGroup | null {
    const groups = simulationStore.selected.groups;
    return groups && groups.getGroup(this.groupName) || null;
  }
},{
  // volatile
},{
  // hooks
  afterCreate() {
    if (this.role === ERole.teacher) {
      this.wasTeacher = true;
    }
  },
  // actions
  setUsername(name:string) {
    this.username = name;
  },
  setRole(role:ERole) {
    this.role = role;
    if (role === ERole.teacher) {
      this.wasTeacher = true;
    }
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
export type IPresenceSnapshot = typeof Presence.SnapshotType;
