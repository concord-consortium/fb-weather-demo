import { types } from "mobx-state-tree";
import { Group, IGroup } from "../models/group";
import * as _ from "lodash";

export const GroupStore = types.model(
  "GroupStore",
  {
    groupMap: types.optional(types.map(Group), {}),

    getGroup(name: string): IGroup | undefined {
      return _.find(this.groups, (group: IGroup) => group.name === name);
    },

    getGroupById(id: string): IGroup | undefined {
      return this.groupMap.get(id);
    },

    get groups(): IGroup[] {
      return this.groupMap.values();
    },

  },
  {
    selectedID: null,
  },
  {
    addGroups(groupNames:string[]) {
      groupNames.forEach((groupName) => {
        let thisGroup = this.getGroup(groupName);
        if (thisGroup) {
          // copy properties from new station to existing one?
        }
        else {
          this.groupMap.put( Group.create({name: groupName}));
        }
      });
    },

  }
);

export type IGroupStore = typeof GroupStore.Type;
