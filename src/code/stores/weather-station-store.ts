import { types } from "mobx-state-tree";
import { WeatherStation, IWeatherStation } from "../models/weather-station";
import * as _ from "lodash";

export const WeatherStationStore = types
  .model("WeatherStationStore", {
    stationMap: types.optional(types.map(WeatherStation), {}),
    selectedID: types.maybe(types.string)
  })
  .views(self => ({
    get selected(): IWeatherStation | null {
      return self.selectedID && self.stationMap.get(self.selectedID) || null;
    },

    getStation(callSign: string): IWeatherStation | undefined {
      return _.find(self.stationMap.values(), (station: IWeatherStation) => station.callSign === callSign);
    },

    getStationByID(id: string): IWeatherStation | undefined {
      return self.stationMap.get(id);
    },

    get stations(): IWeatherStation[] {
      // because we can't iterate over the mobx maps..
      return self.stationMap.values();
    }
  }))
  .actions(self => ({
    addStation(station:IWeatherStation) {
      const thisStation = self.getStation(station.callSign);
      if (thisStation) {} // copy properties to existing one? TBD
      else {
        self.stationMap.put(station);
      }
    }
  }))
  .actions(self => ({
    addStations(stations: IWeatherStation[]) {
      stations.forEach((station) => {
        self.addStation(station);
      });
    },
    select(station: IWeatherStation) {
      self.selectedID = station.id;
    },
    deselect(){
      self.selectedID = null;
    }
  }));
export type IWeatherStationStore = typeof WeatherStationStore.Type;

