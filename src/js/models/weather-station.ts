import { types, destroy } from "mobx-state-tree";
import { v1 as uuid } from "uuid";

// TBD we need to change this data def.
const WeatherDatum = types.model("Datum", {
  time: types.number,
  value: types.number,
});
type IWeatherDatum = typeof WeatherDatum.Type;

const Prediction = types.model("Prediction", {
  predictionType: types.string,
  id: types.optional(types.string, () => uuid()),
  temp: types.number,
  rationale: types.string,
  name: types.optional(types.string, ""),
  imageUrl: types.optional(types.string, "")
});

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
  id: types.optional(types.identifier(types.string),() => uuid()),
  callsign: types.string,
  lat: types.number,
  long: types.number,
  data: types.array(WeatherDatum),
  predictions: types.array(types.reference(Prediction))
},{
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
  setDat(newData:IWeatherDatum) {
    this.data = newData;
  }
});
export type IWeatherStation = typeof WeatherStation.Type;

export const WeatherStationStore = types.model(
  {
    stations: types.array(WeatherStation),
    selected: types.maybe(types.reference(WeatherStation))
  },
  {
    addStation() {
      const station = WeatherStation.create({
        name: "untitled",
        id: uuid(),
        callsign: "",
        imageUrl: "",
        lat: 42.1,
        long: -72.0,
        data: [],
        predictions: []
      });
      this.stations.push(station);
      this.selected = station;
    },
    select(station:IWeatherStation) {
      this.selected=station;
    },
    deselect(){
      this.selected=null;
    }

  }
);

export const weatherStationStore = WeatherStationStore.create({
  stations: [],
  selected: null
});

