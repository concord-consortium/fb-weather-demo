import { types } from "mobx-state-tree";
import { weatherStationStore, WeatherStationStore, IWeatherStation } from "../models/weather-station";
import { NewPrediction, INewPrediction, FreshPrediction } from "../models/prediction";
import { PresenceStore, presenceStore } from "../models/presence";
import { PredictionStore, predictionStore } from "./prediction-store";
import { Firebasify } from "../middlewares/firebase-decorator";

export const ApplicationStore = types.model({
  predictions: PredictionStore,
  weatherStations: WeatherStationStore,
  presences: PresenceStore
});

export const applicationStore = ApplicationStore.create({
  predictions: predictionStore,
  weatherStations: weatherStationStore,
  presences: presenceStore
});

