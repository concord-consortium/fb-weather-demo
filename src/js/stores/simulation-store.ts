import { types } from "mobx-state-tree";
import { v1 as uuid } from "uuid";
import { Firebasify } from "../middlewares/firebase-decorator";
import { Simulation, ISimulation } from "../models/simulation";
import { IWeatherScenario } from "../models/weather-scenario";
import { PresenceStore } from "./presence-store";
import { PredictionStore } from "./prediction-store";
import { SimulationSettings } from "../models/simulation-settings";
import { WeatherStation } from "../models/weather-station";
import { StationSpec, IStationSpec } from "../models/weather-scenario";

const _ = require("lodash");

const createStations = function (stations:IStationSpec[]) {
  const stationMap = {};
  for(let station of stations) {
    stationMap[station.id] = _.clone(station);
  }
  return stationMap;
};

export const SimulationStore = types.model(
  "SimulationStore",
  {
    simulations: types.map(Simulation)
  }, {
    selected: null
  },
  {
    addSimulation(name:string, scenario:IWeatherScenario) {
      const simulation = Simulation.create({
        name: name,
        id: uuid(),
        scenario: scenario,
        presences: PresenceStore.create({}),
        predictions: PredictionStore.create({}),
        stations: createStations(scenario.stations),
        isPlaying: false,
        simulationTime: scenario.startTime,
        simulationSpeed: 1,
        settings: SimulationSettings.create({})
      });
      this.simulations.put(simulation);
      this.selected = simulation;
      return simulation;
    },
    select(simulation:ISimulation) {
      this.selected=simulation;
    },
    deselect(){
      this.selected=null;
    }

  }
);
export type ISimulationStore = typeof SimulationStore.Type;

export const simulationStore = SimulationStore.create({
  simulations: {}
});

Firebasify(simulationStore,"Simulations");

