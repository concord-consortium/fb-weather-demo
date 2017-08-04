import { types } from "mobx-state-tree";
import { v1 as uuid } from "uuid";
import { Firebasify } from "../middlewares/firebase-decorator";
import { Simulation, ISimulation } from "../models/simulation";


export const SimulationStore = types.model(
  "SimulationStore",
  {
    simulations: types.map(Simulation)
  }, {
    selected: null
  },
  {
    // addStation() {
    //   const station = WeatherStation.create({
    //     name: "untitled",
    //     id: uuid(),
    //     callsign: "",
    //     imageUrl: "",
    //     lat: 42.1,
    //     long: -72.0,
    //     data: []
    //   });
    //   this.stations.push(station);
    //   this.selected = station;
    //   return station;
    // },
    addSimulation(name:string, scenario:IWeatherScenario) {
      const simulation = Simulation.create({
        name: name,
        id: uuid(),
      });
      // ... fill in details of simulation from WeatherScenario
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
  stations: {},
  selected: null
});

Firebasify(simulationStore,"Simulations");

