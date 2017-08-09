import { types } from "mobx-state-tree";
import { v1 as uuid } from "uuid";
import { Firebasify } from "../middlewares/firebase-decorator";
import { WeatherStation, IWeatherStation } from "../models/weather-station";
import * as _ from "lodash";

export const WeatherStationStore = types.model(
  "WeatherStationStore",
  {
    stations: types.optional(types.array(WeatherStation), []),
    selected: types.maybe(types.reference(WeatherStation)),

    getStation(stationID: string) : IWeatherStation | undefined {
      return _.find(this.stations, (station: IWeatherStation) => station.id === stationID);
    }
  },
  {
    preProcessSnapshot(snapshot: any) {
      if (snapshot.selected) {
        if (_.findIndex(snapshot.stations,
                        (station: IWeatherStation) => station.id === snapshot.selected) < 0) {
          snapshot.selected = null;
        }
      }
      return snapshot;
    },

    addStation() {
      debugger;
      const station = WeatherStation.create({
        name: "untitled",
        id: uuid(),
        callsign: "",
        imageUrl: "",
        lat: 42.1,
        long: -72.0
      });
      this.stations.push(station);
      this.selected = station;
      return station;
    },
    addStations(stations: IWeatherStation[]) {
      stations.forEach((station) => {
        let thisStation = this.getStation(station.id);
        if (thisStation) {
          // copy properties from new station to existing one?
        }
        else {
          this.stations.push(station);
        }
      });
    },
    select(station:IWeatherStation) {
      this.selected=station;
    },
    deselect(){
      this.selected=null;
    }
  }
);
export type IWeatherStationStore = typeof WeatherStationStore.Type;

