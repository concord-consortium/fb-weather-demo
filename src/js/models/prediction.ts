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
  return NewPrediction.create(
    {
      type: PredictionType.eTemperature,
      timeStamp: new Date(),
      predictedTime: timeInt,
      predictionTime: timeInt,
      predictedValue: -1,
      description: "",
      imageUrl: undefined
    }
  );
};

export const NewPrediction = types.model({
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
export type INewPrediction = typeof NewPrediction.Type;

/*
export interface INewPrediction {
  station?: string;
  type: PredictionType;
  timeStamp?: Date;
  predictionTime?: number;
  predictedTime?: number;
  predictedValue?: number;
  description?: string;
  imageUrl?: string;
}
*/
