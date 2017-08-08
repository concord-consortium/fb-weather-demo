import { types } from "mobx-state-tree";
import { Prediction, IPrediction } from "../models/prediction";
import { IWeatherStation } from "../models/weather-station";
import { presenceStore } from "../stores/presence-store";
import { weatherStationStore } from "../stores/weather-station-store";
import { Firebasify } from "../middlewares/firebase-decorator";

export const PredictionStore = types.model({
  predictions: types.optional(types.array(Prediction), []),
  get prediction(): IPrediction {
    const station = presenceStore.weatherStation;
    let prediction = null;
    if (station) {
      prediction = this.predictions.filter((p:IPrediction) => p.station === station)[0];
    }
    return prediction;
  },
  get teacherPredictions(): IPrediction {
    const station = weatherStationStore.selected;
    let predictions = [];
    if (station) {
      predictions = this.predictions.filter((p:IPrediction) => p.station === station).reverse();
    }
    return predictions;
  },
  get value(): number | null{
    const prediction:IPrediction | null = this.prediction;
    if(prediction) {
      return prediction.predictedValue;
    }
    return null;
  },
  get description(): string | null{
    const prediction:IPrediction | null = this.prediction;
    if(prediction) {
      return prediction.description;
    }
    return null;
  },
  predictionsFor(station:IWeatherStation):IPrediction[] {
    return this.predictions.filter((p:IPrediction)  => p.station === station).reverse();
  },
  predictionFor(station:IWeatherStation):IPrediction|null {
    return this.predictionsFor(station)[0];
  }
},{
  setPrediction(station:IWeatherStation, prediction:IPrediction) {
    prediction.station = station;
  },
  addPrediction(prediction:IPrediction) {
    prediction.timeStamp = new Date();
    prediction.station = presenceStore.weatherStation;
    this.predictions.push(prediction);
  }
});

export const predictionStore = PredictionStore.create({
  predictions: []
});


Firebasify(predictionStore, "Predictions");
