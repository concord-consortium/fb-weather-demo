import { types } from "mobx-state-tree";
import { Presence, IPresence } from "../models/presence";
import { gFirebase } from "../middleware/firebase-imp";
import { IWeatherStation } from "../models/weather-station";
import { v1 as uuid } from "uuid";

export const PresenceStore = types.model(
  "PresenceStore",
  {
    id: types.optional(types.identifier(types.string), () => uuid()),
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
    }
  },{
    // volatile
    selected: null as any as IPresence | null
  },{
    setStation(station:IWeatherStation | null) {
      if(this.selected) {
        this.selected.setStation(station);
      }
    },
    addPresence(presence:IPresence): IPresence {
      this.presences.put(presence);
      this.selected = presence;
      return presence;
    },
    createPresence(id:string): IPresence {
      const presence = Presence.create({id:id});
      return this.addPresence(presence);
    },
    initPresence() {
      const userId = gFirebase.user.uid;
      const existing = this.presences.get(userId);
      if(existing) {
        this.selected=existing;
      }
      else {
        this.createPresence(userId);
      }
      if(this.selected) {
        this.selected.updateTime();
      }
    }
  }
);

export type IPresenceStore = typeof PresenceStore.Type;
