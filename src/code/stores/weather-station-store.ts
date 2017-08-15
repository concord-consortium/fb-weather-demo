import { types } from "mobx-state-tree";
import { WeatherStation, IWeatherStation } from "../models/weather-station";
import * as _ from "lodash";

export const WeatherStationStore = types.model(
  "WeatherStationStore",
  {
    stationMap: types.optional(types.map(WeatherStation), {}),
    selectedID: types.maybe(types.string),

    get selected(): IWeatherStation | null {
      return this.stationMap.get(this.selectedID) || null;
    },

    getStation(callSign: string): IWeatherStation | undefined {
      return _.find(this.stations, (station: IWeatherStation) => station.callSign === callSign);
    },

    getStationByID(id: string): IWeatherStation | undefined {
      return this.stationMap.get(id);
    },

    get stations(): IWeatherStation[] {
      // because we can't iterate over the mobx maps..
      return this.stationMap.values();
    }
  },
  {
    addStations(stations: IWeatherStation[]) {
      stations.forEach((station) => {
        let thisStation = this.getStation(station.callSign);
        if (thisStation) {
          // copy properties from new station to existing one?
        }
        else {
          this.stationMap.put(station);
        }
      });
    },
    select(station: IWeatherStation) {
      this.selectedID = station.id;
    },
    deselect(){
      this.selected = null;
    }
  }
);
export type IWeatherStationStore = typeof WeatherStationStore.Type;

