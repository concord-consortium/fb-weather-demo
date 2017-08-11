import { types, destroy } from "mobx-state-tree";
import { WeatherStationState, kDefaultPrecision } from "./weather-station-state";

export { kDefaultPrecision };

// TBD we need to change this data def.
const WeatherDatum = types.model("Datum", {
  time: types.number,
  value: types.number,
});
type IWeatherDatum = typeof WeatherDatum.Type;

interface WeatherUpdateProps {
  name?: string;
  imageUrl?: string;
  callSign?: string;
  lat?: number;
  long?: number;
}

export const WeatherStation = types.model("WeatherStation",
{
  // properties
  name: types.string,
  imageUrl: types.string,
  id: types.identifier(types.string),
  callSign: types.string,
  lat: types.maybe(types.number),
  long: types.maybe(types.number),

  get temperature(): number | null {
    return this.state && this.state.temperature;
  },

  strTemperature(precision = kDefaultPrecision.temperature): string {
    return this.state && this.state.strTemperature();
  },

  get windSpeed(): number | null {
    return this.state && this.state.windSpeed;
  },

  strWindSpeed(precision = kDefaultPrecision.windSpeed): string {
    return this.state && this.state.strWindSpeed();
  },

  get windDirection(): number | null {
    return this.state && this.state.windDirection;
  },

  strWindDirection(precision = kDefaultPrecision.windDirection): string {
    return this.state && this.state.strWindDirection();
  }
},{
  // volatile
  state: null as any as WeatherStationState | null
},{
  // actions
  setLocation(location: { lat: number, long: number }) {
    this.lat = location.lat;
    this.long = location.long;
  },
  setState(state: WeatherStationState) {
    this.state = state;
  },
  update(props:WeatherUpdateProps) {
    if(props.name !== undefined) {
      this.name = props.name;
    }
    if(props.imageUrl !== undefined) {
      this.imageUrl = props.imageUrl;
    }
    if(props.callSign !== undefined) {
      this.callSign = props.callSign;
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
