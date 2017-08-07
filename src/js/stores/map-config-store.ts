import { types } from "mobx-state-tree";
import { Firebasify } from "../middlewares/firebase-decorator";
import { MapConfig, IMapConfig } from "../models/map-config";
import { IWeatherStation } from "../models/weather-station";

export const MapConfigStore = types.model(
  "MapConfigStore",
  {
    mapConfigs: types.map(MapConfig)
  },{
    selected: types.maybe(types.reference(MapConfig))
  },{
    deselect() {
      this.selected = null;
    },
    select(config:IMapConfig) {
      this.selected = config;
    },
    add(config:IMapConfig) {
      this.mapConfigs.put(config);
      this.select(config);
    },
    delete() {
      if(this.selected) {
        this.mapConfigs.delete(this.selected);
        this.selected = null;
      }
    }
  }
);

export type IMapConfigStore = typeof MapConfigStore.Type;

export const mapConfigStore = MapConfigStore.create({mapConfigs: {}});


Firebasify(mapConfigStore, "MapConfigs");

