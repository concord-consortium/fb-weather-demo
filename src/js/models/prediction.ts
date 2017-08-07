import { types } from "mobx-state-tree";
import { WeatherStation } from "./weather-station";

export enum PredictionType {
  eDescription = 'description',
  eTemperature = 'temperature',
  eHumidity = 'humidity',
  ePrecipitation = 'precipitation',
  eWindSpeed = 'windSpeed',
  eWindDirection = 'windDirection'
}

export const Prediction = types.model({
  station: types.maybe(types.reference(WeatherStation)),  // shouldn't really be maybe
  type: types.enumeration('PredictionType', [
                            PredictionType.eDescription,
                            PredictionType.eTemperature,
                            PredictionType.eHumidity,
                            PredictionType.ePrecipitation,
                            PredictionType.eWindSpeed,
                            PredictionType.eWindDirection
                          ]),
  timeStamp: types.Date,
  predictionTime: types.number,
  predictedTime: types.number,
  predictedValue: types.maybe(types.number),
  description: types.optional(types.string, ""),
  imageUrl: types.maybe(types.string)
}, {

});
export type IPrediction = typeof Prediction.Type;
