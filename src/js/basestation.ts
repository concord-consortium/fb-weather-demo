import { observable } from "mobx";
import { v1 as uuid } from "uuid";

require('datejs'); // extends DateObject with formatting
interface Date {   toString(formatting:string):string; }

export interface BasestationParams {
  name: string;
  imageUrl: string;
  id: string;
  callsign: string;
  lat: number;
  long: number;
  data: Array<{ time: number; value: number }>;
}

export class Basestation implements BasestationParams {
  @observable name: string;
  @observable imageUrl: string;
  @observable id: string;
  @observable callsign: string;
  @observable lat: number;
  @observable long: number;
  @observable data: Array<{ time: number; value: number }>;

  constructor(params:BasestationParams | null) {
    if(params) {
      this.id = params.id;
      this.imageUrl = params.imageUrl;
      this.name = params.name;
      this.callsign = params.callsign;
      this.lat = params.lat;
      this.long = params.long;
      this.data = params.data;
    }
    else {
      this.id = uuid();
      this.imageUrl = "/img/farm.jpg";
      this.name = "set name";
      this.callsign = "XXX";
      this.lat = 0;
      this.long = 0;
      this.data = [];
    }
  }

  dateForFrame(frameNumber:number):string | false {
    if(this.data && this.data.length >= frameNumber) {
      const time:number = this.data[frameNumber].time;
      if (time) {
        const date:Date = new Date(time);
        const dateString:string = date.toString('d');
        const timeString:string = date.toString('t');
        return `${dateString} ${timeString}`;
      }
    }
    return false;
  }
}

export interface BasestationMap {
  [id: string]: Basestation;
}
