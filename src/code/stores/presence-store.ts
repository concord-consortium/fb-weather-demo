import { getSnapshot, types } from "mobx-state-tree";
import { Presence, IPresence, IPresenceSnapshot } from "../models/presence";
import { gFirebase } from "../middleware/firebase-imp";
import { IWeatherStation } from "../models/weather-station";
import { find } from "lodash";

export const PresenceStore = types
  .model("PresenceStore", {
    id: types.optional(types.identifier(types.string), "store"),
    presences: types.optional(types.map(Presence), {})
  })
  .views(self => ({
    get selected(): IPresence | undefined {
      return self.presences.get((gFirebase.user && gFirebase.user.uid) || "");
    },
    get presenceList(): IPresence[] {
      return self.presences.values();
    },
    getPresenceForGroup(group: string): IPresence | undefined {
      return find(self.presences.values(), (presence: IPresence) => {
        return presence && (presence.groupName === group);
      });
    }
  }))
  .views(self => ({
      get weatherStation(): IWeatherStation | null {
      return (self.selected && self.selected.weatherStation) || null;
    },
    get size() {
      return self.presences.size;
    },
    get groupNames() {
      return self.presenceList.map((p:IPresence) => p.groupName);
    },
    get groupName() {
      return (self.selected && self.selected.groupName) || "";
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
      // add presence to map
      self.presences.put(presence);
      return presence;
    },
    deletePresence(_path: string, presenceID: string) {
      const path = `${_path}/presences/presences/${presenceID}`,
            presenceRef = gFirebase.dataRef.child(path);
      if (presenceRef) {
        presenceRef.set(null);
      }
    },
    deleteAllOtherPresences(_path: string) {
      const selfPresence = self.selected,
            selfPresenceID = selfPresence && selfPresence.id,
            selfPresenceSnapshot = selfPresence && getSnapshot(selfPresence);
      if (selfPresenceID) {
        const path = `${_path}/presences/presences`,
              presencesRef = gFirebase.dataRef.child(path),
              presences = { [selfPresenceID]: selfPresenceSnapshot };
        presencesRef.set(presences);
      }
    }
  }));
export type IPresenceStore = typeof PresenceStore.Type;
