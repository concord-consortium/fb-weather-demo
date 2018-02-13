import { types } from "mobx-state-tree";
import { v4 as uuid } from "uuid";
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

export const Presence = types
  .model("Presence", {
    id: types.optional(types.identifier(types.string), ()=> presenceId()),
    username: types.optional(types.string, () => "anonymous"),
    role: types.optional(types.enumeration('Role', [ERole.teacher, ERole.student]), ERole.student),
    // code allows switching pages/roles currently - track whether we've ever been a teacher
    wasTeacher: types.optional(types.boolean, false),
    start: types.optional(types.string, () => new Date().toISOString()),
    weatherStationID: types.maybe(types.string),
    groupName: types.maybe(types.string)
  })
  .views(self => ({
    get weatherStation(): IWeatherStation | null {
      const simulation = simulationStore.selected,
            stations: IWeatherStationStore | null = simulation && simulation.stations,
            stationId = self.weatherStationID;
      return stations && stationId && stations.getStationByID(stationId) || null;
    },
    get group(): IGroup | null {
      const simulation = simulationStore.selected,
            groups = simulation && simulation.groups;
      return groups && self.groupName && groups.getGroup(self.groupName) || null;
    }
  }))
  .actions(self => ({
    afterCreate() {
      if (self.role === ERole.teacher) {
        self.wasTeacher = true;
      }
    },
    setUsername(name:string) {
      self.username = name;
    },
    setRole(role:ERole) {
      self.role = role;
      if (role === ERole.teacher) {
        self.wasTeacher = true;
      }
    },
    setGroupName(name:string) {
      self.groupName = name;
    },
    setStation(station:IWeatherStation | null) {
      self.weatherStationID = station ? station.id : null;
    },
    setStationId(id:string) {
      self.weatherStationID = id;
    },
    updateTime() {
      self.start = new Date().toISOString();
    }
  }));

export type IPresence = typeof Presence.Type;
export type IPresenceSnapshot = typeof Presence.SnapshotType;
