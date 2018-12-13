import { types, destroy } from "mobx-state-tree";
import { WeatherStationState, kDefaultPrecision } from "./weather-station-state";
import { ITempConfig } from "./weather-scenario";
import { Temperature } from "./temperature";

export { kDefaultPrecision };

interface WeatherUpdateProps {
  name?: string;
  imageUrl?: string;
  callSign?: string;
  lat?: number;
  long?: number;
}

export const WeatherStation = types
  .model("WeatherStation", {
    name: types.string,
    imageUrl: types.string,
    id: types.identifier(types.string),
    callSign: types.string,
    lat: types.maybe(types.number),
    long: types.maybe(types.number)
  })
  .volatile(self => ({
    state: null as any as WeatherStationState | null
  }))
  .views(self => ({
    get temperature(): Temperature | null {
      return self.state && self.state.temperature;
    },

    get tempConfig(): ITempConfig | null {
      return self.state && self.state.tempConfig;
    },

    get precipitation(): number | null {
      return self.state && self.state.hourlyPrecipitation;
    },

    get strPrecipitation(): string {
      const precipitation = self.state && self.state.hourlyPrecipitation;
      return precipitation != null
              ? (precipitation ? "Rain" : "Clear")
              : "";
    },

    get windSpeed(): number | null {
      return self.state && self.state.windSpeed;
    },

    get windDirection(): number | null {
      return self.state && self.state.windDirection;
    },

    strWindDirection(precision = kDefaultPrecision.windDirection): string {
      return self.state && self.state.strWindDirection() || "";
    }
  }))
  .actions(self => ({
    setLocation(location: { lat: number, long: number }) {
      self.lat = location.lat;
      self.long = location.long;
    },
    setState(state: WeatherStationState) {
      self.state = state;
    },
    update(props:WeatherUpdateProps) {
      if(props.name !== undefined) {
        self.name = props.name;
      }
      if(props.imageUrl !== undefined) {
        self.imageUrl = props.imageUrl;
      }
      if(props.callSign !== undefined) {
        self.callSign = props.callSign;
      }
      if(props.lat !== undefined) {
        self.lat = props.lat;
      }
      if(props.long !== undefined) {
        self.long = props.long;
      }
    },
    delete() {
      destroy(self);
    }
  }));
export type IWeatherStation = typeof WeatherStation.Type;
