import { types } from "mobx-state-tree";
import { v1 as uuid } from "uuid";


export const MapConfig = types.model(
  "MapConfig",
  {
    id: types.optional(types.string, () => uuid()),
    name: types.optional(types.string, "New Map"),
    lat: types.optional(types.number, 0),
    long: types.optional(types.number, 0),
    zoom: types.optional(types.number, 7)
});
export type IMapConfig = typeof MapConfig.Type;

export interface MapConfigMap {
  [id:string]: IMapConfig;
}
