import { observable, computed } from "mobx";
import { v1 as uuid } from "uuid";


type Dimension = {
  height: number
  width: number
}

export interface LatLong {
  lat: number
  lng: number
}

export interface MapConfigMap {
  [id:string]: MapConfig
}

export class MapConfig {
  @observable id: string
  @observable name: string
  @observable lat: number
  @observable long: number
  @observable zoom: number
  constructor() {
    this.id = uuid();
    this.name = "XX Map";
    this.zoom = 7;
    this.lat = 42;
    this.long = -70;
    debugger
  }
}
