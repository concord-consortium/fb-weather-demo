import { types, destroy, onSnapshot, applySnapshot } from "mobx-state-tree";
import { v1 as uuid } from "uuid";
import { Firebasify } from "../middlewares/firebase-decorator";
import { IWeatherStation, WeatherStation } from "./weather-station";
import { dataStore } from "../data-store";

const getWeatherSimId = () => {
  const sessionID = localStorage.getItem("CCweatherSession") || uuid();
  localStorage.setItem("CCweatherSession", sessionID);
  return uuid();
};

export const Presence = types.model("Precense",
{
  username: types.optional(types.string, () => "anonymous"),
  id: types.optional(types.identifier(types.string),() => getWeatherSimId()),
  start: types.optional(types.Date, () => new Date()),
  weatherStation: types.maybe(types.reference(WeatherStation))
},{
  setUsername(name:string) {
    this.username = name;
  },
  setStation(station:IWeatherStation | null) {
    this.weatherStation = station;
  }
});

export type IPresence = typeof Presence.Type;

export const PresenceStore = types.model(
  {
    presences: types.array(Presence),
    selected: types.maybe(types.reference(Presence)),
    get weatherStation():null | IWeatherStation {
      return this.selected && this.selected.weatherStation;
    }
  },{
    connectionStatus: null,
  },{
    XafterCreate() {
      const firebase = dataStore.firebaseImp;
      if (this.connectionStatus) { this.connectionStatus.off(); }
      this.connectionStatus = firebase.database.ref(".info/connected");
      const setupConnection = function(snapshot: any) {
        // add a new presence for the current browser session...
        console.log(" --- ONLINE --- ");

        if (snapshot.val()) {
          const ref = firebase.refForPath(`Presences/${presence.id}`);
          if(ref) {
            ref.onDisconnect().remove();
          }
        }
      }.bind(this);
      this.connectionStatus.on("value",setupConnection);
    },
    setStation(station:IWeatherStation) {
      if(this.selected) {
        this.selected.setStation(station);
      }
    },
    addPresence(presence:IPresence) {
      this.presences.push(presence);
      this.selected = presence;
    }
  }
);
export type IPresenceStore = typeof PresenceStore.Type;

export const presenceStore = PresenceStore.create({
  presences: []
});

const presence = Presence.create( {
  id: getWeatherSimId(),
  start: new Date(),
  username: "anonymous",
  weatherStation: null
});
presenceStore.addPresence(presence);

Firebasify(presenceStore,"Presences");
