import { types } from "mobx-state-tree";
import { PresenceStore, presenceStore } from "./presence-store";
import { PredictionStore, predictionStore } from "./prediction-store";
import { SimulationStore, simulationStore } from "./simulation-store";
import { WeatherStationStore, weatherStationStore } from "../stores/weather-station-store";

export const ApplicationStore = types.model(
  "ApplicationStore",
  {
    // simulationList: types.array(types.reference(Simulation)),
    simulations: SimulationStore,
    presences: PresenceStore,
    weatherStations: WeatherStationStore,
    predictions: PredictionStore,
    get simulation() {
      return simulationStore.selected;
    },
    get simulationName() {
      if(this.simulation) {
        return this.simulation.name;
      }
      return "(none)";
    }
  },{
  },{

  });

export const applicationStore = ApplicationStore.create({
  // simulationList: simulationStore.getList(),
  simulations: simulationStore,
  presences: presenceStore,
  weatherStations: weatherStationStore,
  predictions: predictionStore
});
