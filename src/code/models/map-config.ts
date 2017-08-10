import { types } from "mobx-state-tree";
import { v1 as uuid } from "uuid";

interface IMapConfigUpdate {
  name?: string;
  lat?: number;
  long?: number;
  zoom?: number;
}
export const MapConfig = types.model(
  "MapConfig",
  {
    id: types.identifier(types.string),
    name: types.optional(types.string, "New Map"),
    lat: types.optional(types.number, 0),
    long: types.optional(types.number, 0),
    zoom: types.optional(types.number, 7)
  },
  { },
  {
    update(params:any) {
      if(params.name) { this.name = params.name; }
      if(params.lat)  { this.lat = params.lat; }
      if(params.long) { this.long = params.long; }
      if(params.zoom) { this.zoom = params.zoom; }
    }
  }
);
export type IMapConfig = typeof MapConfig.Type;
