import { types } from "mobx-state-tree";
import { v4 as uuid } from "uuid";
import { IWeatherStation } from "./weather-station";
import { simulationStore } from "./simulation";

export enum PredictionType {
  eDescription = 'description',
  eTemperature = 'temperature',
  eHumidity = 'humidity',
  ePrecipitation = 'precipitation',
  eWindSpeed = 'windSpeed',
  eWindDirection = 'windDirection'
}

export const Prediction = types
  .model("Prediction", {
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
    imageUrl: types.maybe(types.string)
  })
  .views(self => ({
    get station(): IWeatherStation | null {
      const simulation = simulationStore.selected,
            stations = simulation && simulation.stations;
      return (stations && self.stationID && stations.getStationByID(self.stationID)) || null;
    },

    get predictedValueLabel() {
      switch(self.type) {
        case PredictionType.eTemperature:
          return "Temperature";
        case PredictionType.eWindSpeed:
          return "Wind Speed";
        case PredictionType.eWindDirection:
          return "Wind Direction";
      }
      return "";
    },

    get descriptionLabel() {
      return self.type === PredictionType.eDescription
              ? "Description" : "Rationale";
    },

    formatPredictedValue(options: any): string {
      const simulation = simulationStore.selected;
      if (!simulation) { return ""; }
      switch(self.type) {
        case PredictionType.eTemperature:
          return simulation.formatTemperature(self.predictedValue, options);
        case PredictionType.eWindSpeed:
          return simulation.formatWindSpeed(self.predictedValue, options);
        case PredictionType.eWindDirection:
          return simulation.formatWindDirection(self.predictedValue, options);
      }
      return "";
    }
  }))
  .actions(self => ({
    setStation(station: IWeatherStation) {
      self.stationID = station ? station.id : null;
    }
  }));
export type IPrediction = typeof Prediction.Type;
