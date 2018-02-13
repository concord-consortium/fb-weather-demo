import { types } from "mobx-state-tree";
import { Prediction, IPrediction } from "../models/prediction";
import { IWeatherStation } from "../models/weather-station";
import { simulationStore } from "../models/simulation";

export const PredictionStore = types
  .model("PredictionStore", {
    predictions: types.optional(types.array(Prediction), [])
  })
  .views(self => ({
    get prediction(): IPrediction | null {
      const simulation = simulationStore.selected,
            station = simulation && simulation.presenceStation;
      let prediction = null;
      if (station) {
        prediction = self.predictions.filter((p:IPrediction) => p.station === station)[0];
      }
      return prediction;
    }
  }))
  .views(self => {

    function _predictionsForStation(station:IWeatherStation): IPrediction[] {
      return self.predictions.filter((p:IPrediction)  => p.station === station).reverse();
    }

    return {
      get teacherPredictions(): IPrediction[] {
        const simulation = simulationStore.selected,
              station = simulation && simulation.selectedStation;
        let predictions: IPrediction[] = [];
        if (station) {
          predictions = self.predictions.filter((p:IPrediction) => p.station === station).reverse();
        }
        return predictions;
      },
      get value(): number | null {
        const prediction:IPrediction | null = self.prediction;
        if(prediction) {
          return prediction.predictedValue;
        }
        return null;
      },
      get description(): string | null {
        const prediction:IPrediction | null = self.prediction;
        if(prediction) {
          return prediction.description;
        }
        return null;
      },
      predictionsFor(station:IWeatherStation):IPrediction[] {
        return _predictionsForStation(station);
      },
      predictionFor(station:IWeatherStation): IPrediction | null {
        const predictions = _predictionsForStation(station);
        return predictions && predictions.length && predictions[0] || null;
      }
    };
  })
  .actions(self => ({
    addPrediction(prediction:IPrediction) {
      const simulation = simulationStore.selected,
            station = simulation && simulation.presenceStation;
      if (station) {
        prediction.setStation(station);
        self.predictions.push(prediction);
      }
    }
  }));
export type IPredictionStore = typeof PredictionStore.Type;
