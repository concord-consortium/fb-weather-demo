import { types } from "mobx-state-tree";
import { MapConfig } from "./map-config";
import { WeatherStation } from "./weather-station";
import { gWeatherEventUrl } from "./weather-event";

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
  stations: types.array(StationSpec),
  mapConfig: MapConfig,
  startTime: types.maybe(types.Date),
  endTime: types.maybe(types.Date)
}, {

});
export type IWeatherScenario = typeof WeatherScenario.Type;

export const theWeatherScenario = WeatherScenario.create({
  id: "michigan6",
  name: "Lake Michigan - April 2017 (6 stations)",
  eventUrl: gWeatherEventUrl,
  mapConfig: {
    id: "LakeMichigan1",
    name: "Lake Michigan",
    lat: 41.3,
    long: -85.8,
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
    }
  ]

});

/*
callsign
:
"KASW"
id
:
"da1e1450-76fc-11e7-b827-e1a84a92f89e"
imageUrl
:
"https://upload.wikimedia.org/wikipedia/commons/b/b3/Warsaw-county-building-old.jpg"
lat
:
41.27
long
:
-85.83
name
:
"Warsaw, IN"
__proto__
:
Object
1
:
callsign
:
"KBUU"
id
:
"690b9bc0-7710-11e7-b055-59635b4cfe1a"
imageUrl
:
"http://www.burlington-wi.gov/images/pages/N243/Wehmhoff-Junker%20Park_thumb_thumb_thumb.jpg"
lat
:
42.689
long
:
-88.3
name
:
"Burlington, WI"
__proto__
:
Object
2
:
callsign
:
"KC09"
id
:
"62d539e0-7711-11e7-ad18-1d9455f5974a"
imageUrl
:
"http://lease-an-apartment.com/wp-content/uploads/2011/03/morris-il.jpg"
lat
:
41.43
long
:
-88.419
name
:
"Morris, IL"
__proto__
:
Object
3
:
callsign
:
"KETB"
id
:
"32cd9520-7712-11e7-8db8-a743309e22a6"
imageUrl
:
"https://lauriesportraits.files.wordpress.com/2014/04/img_4291-e1396811845191.jpg"
lat
:
43.419
long
:
-88.129
name
:
"West Bend, WI"
__proto__
:
Object
4
:
callsign
:
"KFWA"
id
:
"84f0f0c0-7719-11e7-9513-2d89b6e7b1a5"
imageUrl
:
"http://cdn.mntm.me/c2/ed/82/Residence_Inn_Fort_Wayne-Fort_Wayne-Indiana-c2ed829ce08c4881a93d75e523c76a8a.jpg"
lat
:
41
long
:
-85.199
name
:
"Fort Wayne, IN"
__proto__
:
Object
5
:
callsign
:
"KIGQ"
id
:
"71c4c500-771c-11e7-b475-9bcbf7495433"
imageUrl
:
"https://c1.staticflickr.com/4/3349/3409762367_a139af5b6e_b.jpg"
lat
:
41.529
long
:
-87.529
name
:
"Lansing, IL"
__proto__
:
Object
6
:
callsign
:
"KIKK"
id
:
"1de73d60-77b1-11e7-b6b4-7da55fc338fc"
imageUrl
:
"https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Kankakee_County_Courthouse.jpg/250px-Kankakee_County_Courthouse.jpg"
lat
:
41.069
long
:
-87.849
name
:
"Kankakee, IL"
*/
