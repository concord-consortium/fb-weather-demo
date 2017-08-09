import { types } from "mobx-state-tree";
import { v1 as uuid } from "uuid";
import { Firebasify } from "../middlewares/firebase-decorator";
import { WeatherStation, IWeatherStation } from "../models/weather-station";
import * as _ from "lodash";

export const WeatherStationStore = types.model(
  "WeatherStationStore",
  {
    stationsMap: types.optional(types.map(WeatherStation), {}),
    selected: types.maybe(types.reference(WeatherStation)),

    getStation(callSign: string) : IWeatherStation | undefined {
      return _.find(this.stations, (station: IWeatherStation) => station.callsign === callSign);
    },

    get stations() {
      // because we cant itterate over the mobx maps..
      return _.map(this.stationsMap.toJSON(), (s) => s);
    }
  },
  {
    preProcessSnapshot(snapshot: any) {
      if (snapshot.selected) {
        if (!snapshot.stationsMap[snapshot.selected]){
          snapshot.selected = null;
        }
      }
      return snapshot;
    },
    addStations(stations: IWeatherStation[]) {
      stations.forEach((station) => {
        let thisStation = this.getStation(station.callsign);
        if (thisStation) {
          // copy properties from new station to existing one?
        }
        else {
          this.stationsMap.put(station);
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

