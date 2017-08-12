import { types } from "mobx-state-tree";
import { MapConfig } from "./map-config";
import { gWeatherEventUrl } from "./weather-event";

export const TimeSpec = types.model({
  year: types.number,
  month: types.number,
  day: types.number,
  hour: types.optional(types.number, 0),
  minute: types.optional(types.number, 0)
});
export type ITimeSpec = typeof TimeSpec.Type;

export const StationSpec = types.model({
  id: types.identifier(types.string),
  name: types.string,
  imageUrl: types.string
});
export type IStationSpec = typeof StationSpec.Type;

export const WeatherScenario = types.model('WeatherScenario', {
  id: types.identifier(types.string),
  name: types.string,
  eventUrl: types.string,
  startTime: types.maybe(TimeSpec),
  endTime: types.maybe(TimeSpec),
  utcOffset: types.maybe(types.number),
  stations: types.array(StationSpec),
  mapConfig: MapConfig
}, {
  // volatile
  _startTime: null as any as Date | null
}, {
  afterCreate() {
    if (this.startTime) {
      const s = this.startTime;
      this._startTime = new Date(Date.UTC(s.year, s.month - 1, s.day, s.hour, s.minute));
    }
  }
});
export type IWeatherScenario = typeof WeatherScenario.Type;

export const theWeatherScenario = WeatherScenario.create({
  id: "michigan6",
  name: "Lake Michigan - April 2017 (8 stations)",
  eventUrl: gWeatherEventUrl,
  startTime: {
    year: 2017,
    month: 3,
    day: 31,
    hour: 18,
    minute: 0
  },
  utcOffset: -5,  // central time zone
  mapConfig: {
    id: "LakeMichigan1",
    lat: 42.3179394544685,
    long: -87.12158203125001,
    name: "Lake Michigan",
    zoom: 7
  },
  stations: [
    {
      id: "KASW", name: "Warsaw, IN",
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/b/b3/Warsaw-county-building-old.jpg"
    },
    {
      id: "KBUU", name: "Burlington, WI",
      imageUrl: "http://www.burlington-wi.gov/images/pages/N243/Wehmhoff-Junker%20Park_thumb_thumb_thumb.jpg"
    },
    {
      id: "KC09", name: "Morris, IL",
      imageUrl: "http://lease-an-apartment.com/wp-content/uploads/2011/03/morris-il.jpg"
    },
    {
      id: "KETB", name: "West Bend, WI",
      imageUrl: "https://lauriesportraits.files.wordpress.com/2014/04/img_4291-e1396811845191.jpg"
    },
    {
      id: "KFWA", name: "Fort Wayne, IN",
      imageUrl: "http://cdn.mntm.me/c2/ed/82/" +
                  "Residence_Inn_Fort_Wayne-Fort_Wayne-Indiana-c2ed829ce08c4881a93d75e523c76a8a.jpg"
    },
    {
      id: "KIGQ", name: "Lansing, IL",
      imageUrl: "https://c1.staticflickr.com/4/3349/3409762367_a139af5b6e_b.jpg"
    },
    {
      id: "KIKK", name: "Kankakee, IL",
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/" +
                  "Kankakee_County_Courthouse.jpg/250px-Kankakee_County_Courthouse.jpg"
    },
    {
      id: "KVPZ", name: "Valparaiso, IN",
      imageUrl: "http://www.preserveindiana.com/images/valpo/valpschl.jpg"
    }
  ]
});
