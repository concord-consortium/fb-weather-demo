import { types } from "mobx-state-tree";
import { Presence, IPresence } from "../models/presence";
import { gFirebase } from "../middleware/firebase-imp";
import { IWeatherStation } from "../models/weather-station";

export const PresenceStore = types.model(
  "PresenceStore",
  {
    id: types.optional(types.identifier(types.string), "store"),
    presences: types.optional(types.map(Presence), {}),
    get weatherStation(): IWeatherStation | null {
      return this.selected && this.selected.weatherStation;
    },
    get presenceList(): IPresence[] {
      return this.presences.values();
    },
    get groupNames() {
      return this.presenceList.map((p:IPresence) => p.groupName);
    },
    get groupName() {
      return this.selected ? this.selected.groupName : "";
    },
    get selected() {
      return this.presences.get(gFirebase.user.uid);
    }
  },{
  },{
    setStation(station:IWeatherStation | null) {
      if(this.selected) {
        this.selected.setStation(station);
      }
    },
    createPresence(id:string): IPresence {
      const presence = Presence.create({id:id});
      this.presences.put(presence);
      return presence;
    },
    init() {
      const userId = gFirebase.user.uid;
      const existing = this.presences.get(userId);
      if(!existing) {
        this.createPresence(userId);
      }
    }
  }
);

export type IPresenceStore = typeof PresenceStore.Type;
