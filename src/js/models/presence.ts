import { types, destroy, onSnapshot, applySnapshot } from "mobx-state-tree";
import { v1 as uuid } from "uuid";
import { Firebasify } from "../middlewares/firebase-decorator";
import { IWeatherStation, WeatherStation } from "./weather-station";
import { dataStore } from "../data-store";

const _ = require("lodash");

const presenceId = () => {
  const sessionID = localStorage.getItem("CCweatherSession") || uuid();
  localStorage.setItem("CCweatherSession", sessionID);
  return sessionID;
};

export const Presence = types.model("Precense",
{
  username: types.optional(types.string, () => "anonymous"),
  id: types.optional(types.identifier(types.string),() => presenceId()),
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

export const PresenceStore = types.model(
  "PresenceStore",
  {
    presences: types.map(Presence),
    get weatherStation():null | IWeatherStation {
      return this.selected && this.selected.weatherStation;
    }
  },{
    selected: null,
  },{
    setStation(station:IWeatherStation) {
      if(this.selected) {
        this.selected.setStation(station);
      }
    },
    addPresence(presence:IPresence) {
      this.presences.put(presence);
      this.selected = presence;
    },
    createPresence() {
      const presence = Presence.create( {
        id: presenceId(),
        start: new Date(),
        username: "anonymous",
        weatherStation: null
      });
      this.addPresence(presence);
    },
    getCurrentPresence() {
      const id = presenceId();
      const existing = this.presences.get(id);
      if(existing) {
        this.selected=existing;
      }
      else {
        this.createPresence();
      }
    }
  }
);
export type IPresenceStore = typeof PresenceStore.Type;

export const presenceStore = PresenceStore.create({presences: {}});


Firebasify(presenceStore, "Presences", ()=> presenceStore.getCurrentPresence());

