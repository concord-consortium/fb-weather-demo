import { types } from "mobx-state-tree";
import { PresenceStore, presenceStore } from "./presence-store";
import { PredictionStore, predictionStore } from "./prediction-store";
import { WeatherStationStore, weatherStationStore } from "../stores/weather-station-store";

export const ApplicationStore = types.model({
  // simulationList: types.array(types.reference(Simulation)),
  // simulations: SimulationStore,
  presences: PresenceStore,
  weatherStations: WeatherStationStore,
  predictions: PredictionStore
});

export const applicationStore = ApplicationStore.create({
  // simulationList: simulationStore.getList(),
  // simulations: simulationStore,
  presences: presenceStore,
  weatherStations: weatherStationStore,
  predictions: predictionStore
});
