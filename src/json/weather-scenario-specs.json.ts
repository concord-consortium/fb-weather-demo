import {IWeatherScenarioSpec} from "../code/models/weather-scenario-spec";
import { TemperatureUnit } from "../code/models/temperature";

export const weatherScenarioSpecs: IWeatherScenarioSpec[] = [
  {
    id: "AK_EP2",
    name: "Alaska Episode 2",
    tempConfig: {
      eventUnit: TemperatureUnit.Fahrenheit,
      bandModel: "six-bands"
    },
    eventUrl: "https://raw.githubusercontent.com/concord-consortium/weather-events/master/events/AK_EP2.json",
    updateInterval: 0.3333333333,
    startTime: {
      year: 2013,
      month: 5,
      day: 15,
      hour: 7,
      minute: 0
    },
    endTime: {
      year: 2013,
      month: 5,
      day: 15,
      hour: 19,
      minute: 0
    },
    utcOffset: 0,
    mapConfig: {
      id: "AK_EP2",
      lat: 42,
      long: -77,
      name: "AK_EP2",
      zoom: 6,
      geoMap: "NomeAlaska"
    },
    stations: []
  },
  {
    id: "AK_EP1",
    name: "Alaska Episode 1",
    tempConfig: {
      eventUnit: TemperatureUnit.Fahrenheit,
      bandModel: "six-bands"
    },
    eventUrl: "https://raw.githubusercontent.com/concord-consortium/weather-events/master/events/AK_EP1.json",
    updateInterval: 0.3333333333,
    startTime: {
      year: 2013,
      month: 5,
      day: 15,
      hour: 7,
      minute: 0
    },
    endTime: {
      year: 2013,
      month: 5,
      day: 15,
      hour: 19,
      minute: 0
    },
    utcOffset: 0,
    mapConfig: {
      id: "AK_EP1",
      lat: 42,
      long: -77,
      name: "AK_EP1",
      zoom: 6,
      geoMap: "NomeAlaska"
    },
    stations: []
  },
  {
    id: "NE_EP2",
    name: "New England Episode 2",
    tempConfig: {
      eventUnit: TemperatureUnit.Fahrenheit,
      bandModel: "six-bands"
    },
    eventUrl: "https://raw.githubusercontent.com/concord-consortium/weather-events/master/events/NE_EP2.json",
    updateInterval: 0.3333333333,
    startTime: {
      year: 2013,
      month: 5,
      day: 15,
      hour: 7,
      minute: 0
    },
    endTime: {
      year: 2013,
      month: 5,
      day: 15,
      hour: 19,
      minute: 0
    },
    utcOffset: 0,
    mapConfig: {
      id: "NE_EP2",
      lat: 42,
      long: -77,
      name: "NE_EP2",
      zoom: 6,
      geoMap: "NewEngland"
    },
    stations: []
  },{
    id: "NE_EP1",
    name: "New England Episode 1",
    tempConfig: {
      eventUnit: TemperatureUnit.Fahrenheit,
      bandModel: "six-bands"
    },
    eventUrl: "https://raw.githubusercontent.com/concord-consortium/weather-events/master/events/NE_EP1.json",
    updateInterval: 0.3333333333,
    startTime: {
      year: 2013,
      month: 5,
      day: 15,
      hour: 7,
      minute: 0
    },
    endTime: {
      year: 2013,
      month: 5,
      day: 15,
      hour: 19,
      minute: 0
    },
    utcOffset: 0,
    mapConfig: {
      id: "NE_EP1",
      lat: 42,
      long: -77,
      name: "NE_EP1",
      zoom: 6,
      geoMap: "NewEngland"
    },
    stations: []
  },
  {
    id: "day-one-v7",
    name: "Day One (v7)",
    tempConfig: {
      eventUnit: TemperatureUnit.Celsius,
      bandModel: "three-bands"
    },
    eventUrl: "https://raw.githubusercontent.com/concord-consortium/weather-events/master/events/day-one-v7.json",
    updateInterval: 1,
    startTime: {
      year: 2018,
      month: 1,
      day: 1,
      hour: 10,
      minute: 0
    },
    endTime: {
      year: 2018,
      month: 1,
      day: 1,
      hour: 14,
      minute: 0
    },
    utcOffset: 0,
    mapConfig: {
      id: "Day One (v7)",
      lat: 42,
      long: 74,
      name: "Day One (v7)",
      zoom: 6
    },
    stations: []
  },
  {
    id: "day-one-v6",
    name: "Day one test (v6)",
    tempConfig: {
      eventUnit: TemperatureUnit.Celsius,
      bandModel: "three-bands"
    },
    eventUrl: "https://raw.githubusercontent.com/concord-consortium/weather-events/master/events/day-one-v6.json",
    updateInterval: 1,
    startTime: {
      year: 2016,
      month: 8,
      day: 21,
      hour: 5,
      minute: 0
    },
    endTime: {
      year: 2016,
      month: 8,
      day: 21,
      hour: 9,
      minute: 0
    },
    utcOffset: 5,
    mapConfig: {
      id: "Day One (v6)",
      lat: 42,
      long: 74,
      name: "Day One (v6)",
      zoom: 6
    },
    stations: []
  },
  {
    id: "day-one-12-23-1970",
    name: "Day one test (v5)",
    tempConfig: {
      eventUnit: TemperatureUnit.Celsius,
      bandModel: "three-bands"
    },
    eventUrl: "https://raw.githubusercontent.com/concord-consortium/weather-events/master/events/day-one-v5.json",
    updateInterval: 1,
    startTime: {
      year: 1970,
      month: 12,
      day: 23,
      hour: 1,
      minute: 0
    },
    endTime: {
      year: 1970,
      month: 12,
      day: 23,
      hour: 8,
      minute: 0
    },
    utcOffset: 0,
    mapConfig: {
      id: "Day One (v5)",
      lat: 42,
      long: 74,
      name: "Day One (v5)",
      zoom: 6
    },
    stations: []
  },
  {
    id: "day-one-12-23-1970",
    name: "Day one test (v4)",
    tempConfig: {
      eventUnit: TemperatureUnit.Celsius,
      bandModel: "three-bands"
    },
    eventUrl: "https://raw.githubusercontent.com/concord-consortium/weather-events/master/events/day-one-v4.json",
    updateInterval: 1,
    startTime: {
      year: 1970,
      month: 12,
      day: 23,
      hour: 1,
      minute: 0
    },
    endTime: {
      year: 1970,
      month: 12,
      day: 23,
      hour: 8,
      minute: 0
    },
    utcOffset: 0,
    mapConfig: {
      id: "Day One (v4)",
      lat: 42,
      long: 74,
      name: "Day One (v4)",
      zoom: 6
    },
    stations: []
  },
  {
    id: "day-one-12-23-1970",
    name: "Day one test",
    tempConfig: {
      eventUnit: TemperatureUnit.Celsius,
      bandModel: "three-bands"
    },
    eventUrl: "https://raw.githubusercontent.com/concord-consortium/weather-events/master/events/day-one.json",
    updateInterval: 1,
    startTime: {
      year: 1970,
      month: 12,
      day: 23,
      hour: 1,
      minute: 0
    },
    endTime: {
      year: 1970,
      month: 12,
      day: 23,
      hour: 8,
      minute: 0
    },
    utcOffset: 0,
    mapConfig: {
      id: "Day One",
      lat: 42,
      long: 74,
      name: "Day One",
      zoom: 6
    },
    stations: []
  },
  {
    id: "lake-michigan-april-2017-8",
    name: "Lake Michigan - April 2017 (8 stations)",
    tempConfig: {
      eventUnit: TemperatureUnit.Celsius,
      bandModel: "three-bands"
    },
    eventUrl: "https://api.github.com/repos/concord-consortium/weather-events/contents/events/lake-michigan.json",
    updateInterval: 1,
    startTime: {
      year: 2017,
      month: 3,
      day: 31,
      hour: 18,
      minute: 0
    },
    utcOffset: -5,
    mapConfig: {
      id: "LakeMichigan1",
      lat: 42.3179394544685,
      long: -87.12158203125001,
      name: "Lake Michigan",
      zoom: 7
    },
    stations: [
      {
        id: "KASW",
        name: "Warsaw, IN",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/b/b3/Warsaw-county-building-old.jpg"
      },
      {
        id: "KBUU",
        name: "Burlington, WI",
        imageUrl: "http://www.burlington-wi.gov/images/pages/N243/Wehmhoff-Junker%20Park_thumb_thumb_thumb.jpg"
      },
      {
        id: "KC09",
        name: "Morris, IL",
        imageUrl: "http://www.billburmaster.com/rmsandw/illinois/mobridge/images/nwbrdg.jpg"
      },
      {
        id: "KETB",
        name: "West Bend, WI",
        imageUrl: "https://lauriesportraits.files.wordpress.com/2014/04/img_4291-e1396811845191.jpg"
      },
      {
        id: "KFWA",
        name: "Fort Wayne, IN",
        imageUrl: "http://cdn.mntm.me/c2/ed/82/Residence_Inn_Fort_Wayne-Fort_Wayne-Indiana-c2ed829ce08c4881a93d75e523c76a8a.jpg"
      },
      {
        id: "KIGQ",
        name: "Lansing, IL",
        imageUrl: "https://c1.staticflickr.com/4/3349/3409762367_a139af5b6e_b.jpg"
      },
      {
        id: "KIKK",
        name: "Kankakee, IL",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Kankakee_County_Courthouse.jpg/250px-Kankakee_County_Courthouse.jpg"
      },
      {
        id: "KVPZ",
        name: "Valparaiso, IN",
        imageUrl: "http://www.preserveindiana.com/images/valpo/valpschl.jpg"
      }
    ]
  }
];

