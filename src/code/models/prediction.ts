import { types } from "mobx-state-tree";
import { v1 as uuid } from "uuid";
import { IWeatherStation } from "./weather-station";
import { simulationStore } from "../stores/simulation-store";

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
  stationID: types.maybe(types.string),
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
  imageUrl: types.maybe(types.string),

  get station(): IWeatherStation | null {
    const stations = simulationStore.stations;
    return (stations && stations.getStationByID(this.stationID)) || null;
  },

  formatPredictedValue(options: any): string {
    switch(this.type) {
      case PredictionType.eTemperature:
        return simulationStore.formatTemperature(this.predictedValue, options);
      case PredictionType.eWindSpeed:
        return simulationStore.formatWindSpeed(this.predictedValue, options);
      case PredictionType.eWindDirection:
        return simulationStore.formatWindDirection(this.predictedValue, options);
    }
    return "";
  }
}, {
  setStation(station: IWeatherStation) {
    this.stationID = station ? station.id : null;
  }
});
export type IPrediction = typeof Prediction.Type;
