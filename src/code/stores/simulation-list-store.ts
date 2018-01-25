import { types } from "mobx-state-tree";
import { Simulation, ISimulation } from "../models/simulation";
import { IWeatherScenarioSpec } from "../models/weather-scenario-spec";
import { v4 as uuid } from "uuid";

const _ = require("lodash");
const SimulationName = types.model({
  name: types.string,
  id: types.optional(types.identifier(types.string), ()=> uuid()),
});

export const SimulationListStore = types
  .model("SimulationListStore", {
    simulations: types.optional(types.map(SimulationName), {})
  })
  .views(self => ({
    get simulationList(): ISimulation[] {
      const names = _.map(self.simulations.values(), 'name');
      return _.sortBy(names, (n: string) => n && n.toLowerCase());
    },
  }))
  .actions(self => ({
    addSimulation(name:string, scenario:IWeatherScenarioSpec): ISimulation {
      const simulation = Simulation.create({
        name: name,
        scenario: scenario
      });
      const simulationName = SimulationName.create( {
        name: simulation.name,
        id: simulation.id
      });
      self.simulations.put(simulationName);
      return simulation;
    },
    deleteSimulation(nameOfDoomed:string) {
      alert("deleteSimulation: Nothing happening at the moment");
    },
    renameSimulation(newName:string) {
      alert("renameSimulation: Nothing happening at the moment");
    },
    copySimulation(oldName:string, newName:string) {
      alert("copySimulation: Nothing happening at the moment");
    }
  }));
export type ISimulationListStore = typeof SimulationListStore.Type;

export const simulationListStore = SimulationListStore.create();

// Firebasify(simulationListStore, "SimulationsList");
