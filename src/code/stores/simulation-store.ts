import { types } from "mobx-state-tree";
import { Firebasify } from "../middleware/firebase-decorator";
import { Simulation, ISimulation } from "../models/simulation";
import { IPresence } from "../models/presence";
import { ISimulationSettings } from "../models/simulation-settings";
import { IWeatherScenario } from "../models/weather-scenario";
import { IWeatherStation } from "../models/weather-station";
import { IMapConfig } from "../models/map-config";
import { IPredictionStore } from "./prediction-store";
import { IPresenceStore } from "./presence-store";
import { IWeatherStationStore } from "./weather-station-store";
const _ = require("lodash");

export const SimulationStore = types.model(
  "SimulationStore",
  {
    simulations: types.map(Simulation),
    selected: types.maybe(types.reference(Simulation)),

    get simulationList(): ISimulation[] {
      return _.sortBy(_.map(this.simulations.values(), 'name'), 'name');
    },
    // Callthrough methods to selected simulation
    get timeString(): string | null {
      return this.selected && this.selected.timeString;
    },
    get mapConfig(): IMapConfig | null {
      return this.selected && this.selected.mapConfig;
    },
    get settings(): ISimulationSettings | null {
      return this.selected && this.selected.settings;
    },
    get predictions(): IPredictionStore | null {
      return this.selected && this.selected.predictions;
    },
    get presences(): IPresenceStore | null {
      return this.selected && this.selected.presences;
    },
    get selectedPresence(): IPresence | null {
      const presences = this.presences;
      return presences && presences.selected;
    },
    get presenceStation(): IWeatherStation | null {
      const selectedPresence = this.selectedPresence;
      return selectedPresence && selectedPresence.weatherStation;
    },
    get stations(): IWeatherStationStore | null {
      return this.selected && this.selected.stations;
    },
    get selectedStation(): IWeatherStation | null {
      const stations = this.stations;
      return stations && stations.selected;
    },
    get simulationTime(): Date | null {
      return this.selected && this.selected.time;
    },
    get simulationName(): string | null {
      return this.selected && this.selected.name;
    }
  },{

  },
  {
    addSimulation(name:string, scenario:IWeatherScenario): ISimulation {
      const simulation = Simulation.create({
        name: name,
        scenario: scenario
      });
      this.simulations.put(simulation);
      return simulation;
    },
    select(simulation:ISimulation) {
      this.selected=simulation.id;
    },
    selectById(id:string) {
      this.selected=this.simulations.get(id).id;
    },
    selectByName(name:string): ISimulation | null {
      const finder = (i:ISimulation) => {
        console.log(i);
        return i.name === name;
      };
      const found = _.find(this.simulations.toJSON(), finder);
      if(found) {
        this.selected = found.id;
        return found;
      }
      return null;
    },
    deselect(){
      this.selected=null;
    },
    deleteSimulation(nameOfDoomed:string) {
      alert("deleteSimulation: Nothing happening at the moment");
    },
    renameSimulation(newName:string) {
      alert("renameSimulation: Nothing happening at the moment");
    },
    copySimulation(oldName:string, newName:string) {
      alert("copySimulation: Nothing happening at the moment");
    },
     setPref(key: string, value: any) {
      if(this.settings) {
        this.settings.setSetting(key, value);
      }
    },
    rewind() {
      if(this.selected) { this.selected.rewind(); }
    },
    play() {
      if(this.selected) { this.selected.play(); }
    },
    stop() {
      if(this.selected) { this.selected.stop(); }
    },
    stepForward() {
      if(this.selected) { this.selected.stepForward(); }
    },
    stepBack() {
      if(this.selected) { this.selected.stepBack(); }
    }
  }
);
export type ISimulationStore = typeof SimulationStore.Type;

export const simulationStore = SimulationStore.create({
  simulations: {},
  selected: null
});

Firebasify(simulationStore,"Simulations");

