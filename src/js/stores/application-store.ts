import { types } from "mobx-state-tree";
import { PresenceStore, presenceStore } from "../models/presence";
import { PredictionStore, predictionStore } from "./prediction-store";
import { WeatherStationStore, weatherStationStore } from "../stores/weather-station-store";

export const ApplicationStore = types.model({
  presences: PresenceStore,
  weatherStations: WeatherStationStore,
  predictions: PredictionStore
});

export const applicationStore = ApplicationStore.create({
  presences: presenceStore,
  weatherStations: weatherStationStore,
  predictions: predictionStore
});

