import { observable } from "mobx";
import { v1 as uuid } from "uuid";

export class Basestation {
  @observable name: string;
  @observable imageUrl: string;
  @observable id: string;
  @observable callsign: string;
  @observable lat: number;
  @observable long: number;
  @observable data: { time: number; value: number }[];
  constructor() {
    this.id = uuid();
    this.imageUrl = "/img/farm.jpg";
    this.name = "set name";
    this.callsign = "XXX";
    this.lat = 0;
    this.long = 0;
    this.data = [];
  }
}

export interface BasestationMap {
  [id: string]: Basestation;
}
