import { types } from "mobx-state-tree";
import { WeatherStation, IWeatherStation } from "./weather-station";
import { v1 as uuid } from "uuid";

export enum PredictionType {
  eDescription = 'description',
  eTemperature = 'temperature',
  eHumidity = 'humidity',
  ePrecipitation = 'precipitation',
  eWindSpeed = 'windSpeed',
  eWindDirection = 'windDirection'
}

export const Prediction = types.model("Prediction", {
  id: types.optional(types.identifier(types.string), () => uuid()),
  station: types.maybe(types.reference(WeatherStation)),
  type: types.enumeration('PredictionType', [
                            PredictionType.eDescription,
                            PredictionType.eTemperature,
                            PredictionType.eHumidity,
                            PredictionType.ePrecipitation,
                            PredictionType.eWindSpeed,
                            PredictionType.eWindDirection
                          ]),
  timeStamp: types.optional(types.Date, () => new Date()),
  predictionTime: types.Date,
  predictedTime: types.Date,
  predictedValue: types.maybe(types.number),
  description: types.optional(types.string, ""),
  imageUrl: types.maybe(types.string)
}, {
  setStation(station: IWeatherStation) {
    this.station = station;
  }
});
export type IPrediction = typeof Prediction.Type;
