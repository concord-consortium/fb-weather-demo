import { types } from "mobx-state-tree";
import { Presence, IPresence, IPresenceSnapshot } from "../models/presence";
import { gFirebase } from "../middleware/firebase-imp";
import { IWeatherStation } from "../models/weather-station";

export const PresenceStore = types
  .model("PresenceStore", {
    id: types.optional(types.identifier(types.string), "store"),
    presences: types.optional(types.map(Presence), {})
  })
  .views(self => ({
    get selected(): IPresence | undefined{
      return self.presences.get(gFirebase.user.uid);
    },
    get presenceList(): IPresence[] {
      return self.presences.values();
    }
  }))
  .views(self => ({
      get weatherStation(): IWeatherStation | null {
      return self.selected && self.selected.weatherStation || null;
    },
    get size() {
      return self.presences.size;
    },
    get groupNames() {
      return self.presenceList.map((p:IPresence) => p.groupName);
    },
    get groupName() {
      return self.selected && self.selected.groupName || "";
    }
  }))
  .actions(self => ({
    setStation(station:IWeatherStation | null) {
      if(self.selected) {
        self.selected.setStation(station);
      }
    },
    createPresence(_path:string, snapshot:IPresenceSnapshot): IPresence {
      const firebase = gFirebase;
      const presence = Presence.create(snapshot);
      const path = `${_path}/presences/presences/${snapshot.id}`;
      const presref = firebase.dataRef.child(path);
      presref.onDisconnect().remove();
      self.presences.put(presence);
      return presence;
    }
  }));
export type IPresenceStore = typeof PresenceStore.Type;
