import { types } from "mobx-state-tree";

interface IMapConfigUpdate {
  name?: string;
  lat?: number;
  long?: number;
  zoom?: number;
}
export const MapConfig = types
.model("MapConfig", {
  id: types.identifier(types.string),
  name: types.optional(types.string, "New Map"),
  lat: types.optional(types.number, 0),
  long: types.optional(types.number, 0),
  zoom: types.optional(types.number, 7)
})
.actions(self => ({
  update(params: IMapConfigUpdate) {
    if(params.name) { self.name = params.name; }
    if(params.lat)  { self.lat = params.lat; }
    if(params.long) { self.long = params.long; }
    if(params.zoom) { self.zoom = params.zoom; }
  }
}));
export type IMapConfig = typeof MapConfig.Type;
