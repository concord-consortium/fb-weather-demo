import { observable, computed } from "mobx";
import { v1 as uuid } from "uuid";

type GeoCoordinate = {
  lat:number
  long:number
}

type GeoRegion = {
  start: GeoCoordinate
  end: GeoCoordinate
}

type Dimension = {
  height: number
  width: number
}

export interface GeoMapMap {
  [id:string]: GeoMap
}

export class GeoMap {
  @observable id: string
  @observable name: string
  @observable loaded: boolean;
  @observable region: GeoRegion;
  @observable size: Dimension;
  image: HTMLImageElement;
  _imageUrl: string;
  constructor() {
    this.id = uuid();
    this.name = "Map";
    this.loaded = false;
    this.size = {width: 0, height: 0};
    this.image = new Image();
    this.image.onload = this.measureImage.bind(this);
    this.imageUrl = "./img/azores.jpg";
  }

  measureImage() {
    this.size   = { width: this.image.width, height: this.image.height };
    this.loaded = (this.image.width > 0) && (this.image.height > 0);
    console.log(`loaded image:  ${this.image.width} x ${this.image.height}`);
  }

  get imageUrl() {
    if(this.loaded) {
      return this._imageUrl;
    }
    return "";
  }

  set imageUrl(url: string){
    if (url == this._imageUrl) { return };
    this.loaded = false;
    this._imageUrl = url;
    this.image.src = url;
  }
}
