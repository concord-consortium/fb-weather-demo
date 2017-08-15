import { types } from "mobx-state-tree";
import { WeatherStation, IWeatherStation } from "../models/weather-station";
import * as _ from "lodash";

export const WeatherStationStore = types.model(
  "WeatherStationStore",
  {
    stationMap: types.optional(types.map(WeatherStation), {}),
    selected: types.maybe(types.reference(WeatherStation)),

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
    preProcessSnapshot(snapshot: any) {
      if (snapshot.selected) {
        if (!snapshot.stationMap[snapshot.selected]){
          snapshot.selected = null;
        }
      }
      return snapshot;
    },
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
    select(station:IWeatherStation) {
      // When converting weatherStations to a Map from an array
      // this method of selected=station stopped working (?)
      // now we have to specify the station id...
      this.selected=station.id;
    },
    deselect(){
      this.selected=null;
    }
  }
);
export type IWeatherStationStore = typeof WeatherStationStore.Type;

