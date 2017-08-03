import { types } from "mobx-state-tree";
import { WeatherStation, IWeatherStation, weatherStationStore } from "../models/weather-station";
import { NewPrediction, INewPrediction, FreshPrediction } from "../models/prediction";
import { presenceStore } from "../models/presence";
import { Firebasify } from "../middlewares/firebase-decorator";

export const PredictionStore = types.model({
  predictions: types.array(NewPrediction),
  get prediction(): INewPrediction {
    const station = presenceStore.weatherStation;
    let prediction = null;
    if (station) {
      prediction = this.predictions.filter((p:INewPrediction) => p.station === station)[0];
    }
    return prediction || FreshPrediction();
  },
  get teacherPredictions(): INewPrediction {
    const station = weatherStationStore.selected;
    let predictions = [];
    if (station) {
      predictions = this.predictions.filter((p:INewPrediction) => p.station === station).reverse();
    }
    return predictions;
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
  },
  predictionsFor(station:IWeatherStation):INewPrediction[] {
    return this.predictions.filter((p:INewPrediction)  => p.station === station).reverse();
  },
  predictionFor(station:IWeatherStation):INewPrediction|null {
    return this.predictionsFor(station)[0];
  }
},{
  setPrediction(station:IWeatherStation, prediction:INewPrediction) {
    prediction.station = station;
  },
  addPrediction(prediction:INewPrediction) {
    prediction.timeStamp = new Date();
    prediction.station = presenceStore.weatherStation;
    this.predictions.push(prediction);
  }
});

export const predictionStore = PredictionStore.create({
  predictions: []
});


Firebasify(predictionStore, "Predictions");
