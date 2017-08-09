import { types } from "mobx-state-tree";
import { v1 as uuid } from "uuid";
import { Firebasify } from "../middlewares/firebase-decorator";
import { Simulation, ISimulation } from "../models/simulation";
import { IWeatherScenario } from "../models/weather-scenario";
import { PresenceStore } from "./presence-store";
import { PredictionStore } from "./prediction-store";
import { SimulationSettings } from "../models/simulation-settings";
import { WeatherStation } from "../models/weather-station";
import { WeatherStationStore } from "../stores/weather-station-store";
import { StationSpec, IStationSpec, theWeatherScenario } from "../models/weather-scenario";
const _ = require("lodash");

let debugCounter = 0;

const createStations = function (stations:IStationSpec[]) {
  return _.map(stations, (s:IStationSpec) => {
    const spec = {
      name: s.name,
      imageUrl: s.imageUrl,
      id: s.id,
      callsign: s.id
    };
    return WeatherStation.create(spec);
  });

};

export const SimulationStore = types.model(
  "SimulationStore",
  {
    simulations: types.map(Simulation),
    selected: types.maybe(types.reference(Simulation)),
    get simulationList() {
      return _.sortBy(_.map(this.simulations.toJSON(), 'name'), 'name');
    },
    // Callthrough methods to selected simulation
    get timeString() {
      return this.selected && this.selected.timeString;
    },
    get mapConfig() {
      return this.selected && this.selected.mapConfig;
    },
    get settings() {
      return this.selected && this.selected.settings;
    },
    get predictions() {
      return this.selected && this.selected.predictions;
    },
    get presences() {
      return this.selected && this.selected.presences;
    },
    get stations() {
      return this.selected && this.selected.stations;
    },
    get simulationTime() {
      return this.selected && this.selected.simulationTime;
    },
    get simulationName() {
      return this.selected && this.selected.name;
    }
  },{

  },
  {
    addSimulation(name:string, scenario:IWeatherScenario) {
      const predictionStore = PredictionStore.create();
      const presenceStore = PresenceStore.create();
      const settings = SimulationSettings.create();
      const weatherStationStore = WeatherStationStore.create({
        stations: createStations(scenario.stations),
        selected: null
      });
      const simulation = Simulation.create({
        name: name,
        id: uuid(),
        scenario: scenario,
        presences: presenceStore,
        predictions: predictionStore,
        stations: weatherStationStore,
        isPlaying: false,
        simulationTime: scenario.startTime,
        simulationSpeed: 1,
        settings: settings
      });

      this.simulations.put(simulation);
      this.selected = simulation.id;
      return simulation;
    },
    select(simulation:ISimulation) {
      this.selected=simulation.id;
    },
    selectById(id:string) {
      this.selected=this.simulations.get(id).id;
    },
    selectByName(name:string) {
      const finder = (i:ISimulation) => {
        console.log(i);
        return i.name === name;
      };
      const found = _.find(this.simulations.toJSON(), finder);
      if(found) {
        this.selected = found.id;
      }
      else {
        this.addSimulation(name, theWeatherScenario);
      }
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
    stop() {
      if(this.selected) { this.selected.stop(); }
    },
    play() {
      if(this.selected) { this.selected.play(); }
    },
    rewind() {
      if(this.selected) { this.selected.rewind(); }
    }
  }
);
export type ISimulationStore = typeof SimulationStore.Type;

export const simulationStore = SimulationStore.create({
  simulations: {},
  selected: null
});

Firebasify(simulationStore,"Simulations");

