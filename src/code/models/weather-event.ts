import * as _ from "lodash";
import * as moment from 'moment';

class WeatherEvent {
  url: string;
  stations: any;
  stationsPromise: any;
  error: any;
  startTime: Date;
  endTime: Date;

  constructor(url: string) {
    this.url = url;

    const p = fetch(url).then((response) => {
                if (response.status >= 200 && response.status < 300) {
                  return response.json();
                }
                throw Error(response.statusText);
              })
              .then((jsonResponse) => {
                // Github API base64-encodes content
                if (jsonResponse.content) {
                  return JSON.parse(atob(jsonResponse.content));
                }
                throw Error("Content not found");
              })
              .then((stationData) => {
                if (stationData) {
                  stationData.forEach((station: any) => {
                    const timeIndex = _.findIndex(station.cols, (name: string) => {
                                        return name.toLowerCase() === "time";
                                      });
                    if (timeIndex && station.rows) {
                      _.forEach(station.rows, (row) => {
                        const timeStr = row[timeIndex],
                              // seems like weather station times are UTC?
                              time = moment(timeStr, "M/D/YY H:m").utcOffset(0, true),
                              jsTime = time.toDate();
                        if (time.isValid()) {
                          row[timeIndex] = jsTime;

                          if (!this.startTime || (jsTime < this.startTime)) {
                            this.startTime = jsTime;
                          }
                          if (!this.endTime || (jsTime > this.endTime)) {
                            this.endTime = jsTime;
                          }
                        }
                      });
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
                                  return station.id === stationID;
                                });
              }
            });
  }
}

// use Github API until we sort out deployment
export const gWeatherEventUrl =
  "https://api.github.com/repos/concord-consortium/weather-events/contents/events/lake-michigan.json";
export const gWeatherEvent = new WeatherEvent(gWeatherEventUrl);
