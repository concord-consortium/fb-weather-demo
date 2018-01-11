import { types } from "mobx-state-tree";
import { Presence, IPresence, IPresenceSnapshot } from "../models/presence";
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
    get size() {
      return this.presences.size;
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
    createPresence(_path:string, snapshot:IPresenceSnapshot): IPresence {
      const firebase = gFirebase;
      const presence = Presence.create(snapshot);
      const path = `${_path}/presences/presences/${snapshot.id}`;
      const presref = firebase.dataRef.child(path);
      presref.onDisconnect().remove();
      this.presences.put(presence);
      return presence;
    }
  }
);

export type IPresenceStore = typeof PresenceStore.Type;
