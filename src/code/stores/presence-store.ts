import { types } from "mobx-state-tree";
import { Presence, IPresence, presenceId } from "../models/presence";
import { IWeatherStation } from "../models/weather-station";
import { v1 as uuid } from "uuid";

export const PresenceStore = types.model(
  "PresenceStore",
  {
    id: types.optional(types.identifier(types.string), () => uuid()),
    presences: types.optional(types.map(Presence), {}),
    get weatherStation():null | IWeatherStation {
      return this.selected && this.selected.weatherStation;
    }
  },{
    selected: null
  },{
    setStation(station:IWeatherStation | null) {
      if(this.selected) {
        this.selected.setStation(station);
      }
    },
    addPresence(presence:IPresence) {
      this.presences.put(presence);
      this.selected = presence;
      return presence;
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
    initPresence() {
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
