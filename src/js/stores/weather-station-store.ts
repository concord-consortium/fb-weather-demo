import { types } from "mobx-state-tree";
import { v1 as uuid } from "uuid";
import { Firebasify } from "../middlewares/firebase-decorator";
import { WeatherStation, IWeatherStation } from "../models/weather-station";


export const WeatherStationStore = types.model(
  "WeatherStationStore",
  {
    stations: types.optional(types.array(WeatherStation), []),
    selected: types.maybe(types.reference(WeatherStation))
  },
  {
    preProcessSnapshot(snapshot: any) {
      if (snapshot.selected) {
        if (snapshot.stations.findIndex(function(station: IWeatherStation) {
                                        return station.id === snapshot.selected;
                                      }) < 0) {
          snapshot.selected = null;
        }
      }
      return snapshot;
    },

    addStation() {
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
    select(station:IWeatherStation) {
      this.selected=station;
    },
    deselect(){
      this.selected=null;
    }

  }
);
export type IWeatherStationStore = typeof WeatherStationStore.Type;

export const weatherStationStore = WeatherStationStore.create({
  stations: [],
  selected: null
});

Firebasify(weatherStationStore,"WeatherStations");

