import { types } from "mobx-state-tree";
import { WeatherStation, IWeatherStation } from "../models/weather-station";
import { NewPrediction, INewPrediction, FreshPrediction } from "../models/prediction";
import { presenceStore } from "../models/presence";
import { Firebasify } from "../middlewares/firebase-decorator";

export const PredictionStore = types.model({
  predictions: types.array(NewPrediction),
  get prediction(): INewPrediction {
    const station = presenceStore.weatherStation;
    if (station) {
      return this.predictions.filter((p:INewPrediction) => p.station === station).first;
    }
    return FreshPrediction();
  },
  get value(): number | null{
    const prediction:INewPrediction | null = this.prediction;
    if(prediction) {
      return prediction.predictedValue;
    }
    return null;
  },
  get description(): string | null{
    const prediction:INewPrediction | null = this.prediction;
    if(prediction) {
      return prediction.description;
    }
    return null;
  }
},{
  predictionsFor(station:IWeatherStation):INewPrediction[] {
    return this.predictions.filter((p:INewPrediction)  => p.station === station);
  },
  predictionFor(station:IWeatherStation):INewPrediction|null {
    return this.predictionsFor.last;
  },
  setPrediction(station:IWeatherStation, prediction:INewPrediction) {
    prediction.station = station;
  }
});

export const predictionStore = PredictionStore.create({
  predictions: []
});


Firebasify(predictionStore, "Predictions");
