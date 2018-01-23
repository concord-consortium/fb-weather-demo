import { types } from "mobx-state-tree";
import { v1 as uuid } from "uuid";


export const Group = types
  .model('Group', {
    id: types.optional(types.identifier(types.string), () => uuid()),
    name: types.string,
    inUse: types.optional(types.boolean, false)
  })
  .actions(self => ({
    select() {
      self.inUse = true;
    },
    deselect() {
      self.inUse = false;
    }
  }));
export type IGroup = typeof Group.Type;
