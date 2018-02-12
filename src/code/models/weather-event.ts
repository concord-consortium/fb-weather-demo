import * as _ from "lodash";
import * as moment from 'moment';
import { gWeatherScenarioSpec } from "./weather-scenario-spec";

class WeatherEvent {
  url: string;
  stations: any;
  stationsPromise: any;
  error: any;
  startTime: Date;  // UTC Date
  duration: number; // seconds

  constructor(url: string) {
    this.url = url;

    const p = fetch(url).then((response) => {
                if (response.status >= 200 && response.status < 300) {
                  return response.json();
                }
                throw Error(response.statusText);
              })
              .then((jsonResponse) => {
                return jsonResponse;
              }).catch( (e) => {
                console.log(e);
              })
              .then((stationData) => {
                if (stationData) {
                  stationData.forEach((station: any) => {
                    const timeIndex = _.findIndex(station.cols, (name: string) => {
                                        return name.toLowerCase() === "time";
                                      });
                    if (timeIndex && station.rows) {
                      let endTime: Date = this.startTime;
                      _.forEach(station.rows, (row) => {
                        const timeStr = row[timeIndex],
                              // seems like weather station times are UTC?
                              time = moment.utc(timeStr, "M/D/YYYY H:m"),
                              jsTime = time.toDate();
                        if (time.isValid()) {
                          row[timeIndex] = jsTime;

                          if (!this.startTime || (jsTime < this.startTime)) {
                            this.startTime = jsTime;
                          }
                          if (!endTime || (jsTime > endTime)) {
                            endTime = jsTime;
                          }
                        }
                      });
                      if (endTime) {
                        this.duration = endTime && (endTime.getTime() - this.startTime.getTime()) / 1000;
                      }
                    }
                  });
                }
                return stationData;
              });
    this.stationsPromise = p;

    this.stationsPromise
      .then((jsonContents: any) => {
        this.stations = jsonContents;
      })
      .catch((err: any) => {
        console.log('Fetch Error :-S', err);
        this.error = err;
      });
  }

  stationData(stationID: string) {
    return this.stationsPromise
            .then((stations: any) => {
              if (stations) {
                return stations.find((station: any) => {
                                  return station.id.toLowerCase() === stationID.toLowerCase();
                                });
              }
            });
  }
}

export const gWeatherEvent = new WeatherEvent(gWeatherScenarioSpec.eventUrl);
