import { types } from "mobx-state-tree";
import { v1 as uuid } from "uuid";


export const Group = types.model('Group', {
  id: types.optional(types.identifier(types.string), ()=> uuid()),
  name: types.string,
  inUse: types.optional(types.boolean, false),
}, {
  // volatile
}, {
  select() {
    this.inUse = true;
  },
  deselect() {
    this.inUse = false;
  }
});
export type IGroup = typeof Group.Type;
