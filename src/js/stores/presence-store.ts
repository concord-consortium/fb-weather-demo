import { types } from "mobx-state-tree";
import { Firebasify } from "../middlewares/firebase-decorator";
import { Presence, IPresence, presenceId } from "../models/presence";
import { IWeatherStation } from "../models/weather-station";

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

