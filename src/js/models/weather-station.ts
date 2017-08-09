import { types, destroy } from "mobx-state-tree";

// TBD we need to change this data def.
const WeatherDatum = types.model("Datum", {
  time: types.number,
  value: types.number,
});
type IWeatherDatum = typeof WeatherDatum.Type;

interface WeatherUpdateProps {
  name?: string;
  imageUrl?: string;
  callsign?: string;
  lat?: number;
  long?: number;
}

export const WeatherStation = types.model("WeatherStation",
{
  name: types.string,
  imageUrl: types.string,
  id: types.identifier(types.string),
  callsign: types.string,
  lat: types.maybe(types.number),
  long: types.maybe(types.number),
  get temp() {
    return 3; //TODO ???
  }
},{
  setLocation(location: { lat: number, long: number }) {
    this.lat = location.lat;
    this.long = location.long;
  },
  update(props:WeatherUpdateProps) {
    if(props.name !== undefined) {
      this.name = props.name;
    }
    if(props.imageUrl !== undefined) {
      this.imageUrl = props.imageUrl;
    }
    if(props.callsign !== undefined) {
      this.callsign = props.callsign;
    }
    if(props.lat !== undefined) {
      this.lat = props.lat;
    }
    if(props.long !== undefined) {
      this.long = props.long;
    }
  },
  delete() {
    destroy(this);
  },
  setData(newData:IWeatherDatum) {
    this.data = newData;
  }
});

export type IWeatherStation = typeof WeatherStation.Type;
