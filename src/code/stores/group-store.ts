import { types } from "mobx-state-tree";
import { Group, IGroup } from "../models/group";
import * as _ from "lodash";

export const GroupStore = types
  .model("GroupStore", {
    groupMap: types.optional(types.map(Group), {})
  })
  .volatile(self=> ({
    selectedID: null as (string | null),
  }))
  .views(self => ({
    getGroup(name: string): IGroup | undefined {
      return _.find(self.groupMap.values(), (group: IGroup) => group.name === name);
    },

    getGroupById(id: string): IGroup | undefined {
      return self.groupMap.get(id);
    },

    get selectedGroup(): IGroup | undefined {
      return self.selectedID ? self.groupMap.get(self.selectedID) : undefined;
    },

    get groups(): IGroup[] {
      return self.groupMap.values().sort((group1: IGroup, group2: IGroup) => {
        if (group1.name < group2.name) { return -1; }
        if (group1.name > group2.name) { return 1; }
        return 0;
      });
    }
  }))
  .actions(self => ({
    addGroups(groupNames:string[]) {
      groupNames.forEach((groupName) => {
        let group = self.getGroup(groupName);
        if (group) {
          // copy properties from new station to existing one?
        }
        else {
          self.groupMap.put(Group.create({name: groupName}));
        }
      });
    }

  }));
export type IGroupStore = typeof GroupStore.Type;
