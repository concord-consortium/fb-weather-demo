import { types } from "mobx-state-tree";
import { WeatherStation } from "./weather-station";

/* Requires TypeScript 2.4
export enum PredictionType {
  eDescription = 'description',
  eTemperature = 'temperature',
  eHumidity = 'humidity',
  ePrecipitation = 'precipitation',
  eWindSpeed = 'windSpeed',
  eWindDirection = 'windDirection'
}
*/
export const PredictionType = {
  eDescription: 'description',
  eTemperature: 'temperature',
  eHumidity: 'humidity',
  ePrecipitation: 'precipitation',
  eWindSpeed: 'windSpeed',
  eWindDirection: 'windDirection'
};

export const FreshPrediction = function(){
  const time = new Date();
  const timeInt = time.getUTCSeconds();
  return Prediction.create(
    {
      type: PredictionType.eTemperature,
      timeStamp: new Date(),
      predictedTime: timeInt,
      predictionTime: timeInt,
      predictedValue: -1,
      description: "",
      imageUrl: ""
    }
  );
};

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
  predictedValue: types.number,
  description: types.string,
  imageUrl: types.union(types.string, types.undefined)
}, {

});
export type IPrediction = typeof Prediction.Type;
