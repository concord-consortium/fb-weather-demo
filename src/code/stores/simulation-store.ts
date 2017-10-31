import { types } from "mobx-state-tree";
import { Firebasify } from "../middleware/firebase-decorator";
import { Simulation, ISimulation } from "../models/simulation";
import { IPresence } from "../models/presence";
import { ISimulationSettings, IFormatTempOptions, IFormatWindSpeedOptions } from "../models/simulation-settings";
import { IWeatherScenarioSpec } from "../models/weather-scenario-spec";
import { IWeatherStation } from "../models/weather-station";
import { IMapConfig } from "../models/map-config";
import { IPredictionStore } from "./prediction-store";
import { IPresenceStore } from "./presence-store";
import { IWeatherStationStore } from "./weather-station-store";
const _ = require("lodash");

export const SimulationStore = types.model(
  "SimulationStore",
  {
    simulations: types.optional(types.map(Simulation), {}),

    get simulationList(): ISimulation[] {
      const names = _.map(this.simulations.values(), 'name');
      return _.sortBy(names, (n: string) => n && n.toLowerCase());
    },
    // Callthrough methods to selected simulation
    get timeString(): string {
      return (this.selected && this.selected.timeString) || "";
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
    get simulationName(): string {
      return (this.selected && this.selected.name) || "";
    },

    // formats a simulation time, i.e. with simulation's UTC offset
    formatTime(time: Date | null, format?: string): string {
      return (this.selected && this.selected.formatTime(time, format)) || "";
    },
    // formats a local time, i.e. with local UTC offset
    formatLocalTime(time: Date | null, format?: string): string {
      return (this.settings && this.settings.formatLocalTime(time, format)) || "";
    },
    formatTemperature(temp: number | null, options: IFormatTempOptions): string {
      return this.settings ? this.settings.formatTemperature(temp, options) : "";
    },
    parseTemperature(temp: string): number | null {
      return this.settings && this.settings.parseTemperature(temp);
    },
    formatWindSpeed(windSpeed: number | null, options: IFormatWindSpeedOptions): string {
      return this.settings ? this.settings.formatWindSpeed(windSpeed, options) : "";
    },
    parseWindSpeed(windSpeed: string): number | null {
      return this.settings && this.settings.parseWindSpeed(windSpeed);
    },
    formatWindDirection(windSpeed: number | null, options: IFormatWindSpeedOptions): string {
      return this.settings ? this.settings.formatWindDirection(windSpeed, options) : "";
    },
    parseWindDirection(windDirection: string): number | null {
      return this.settings && this.settings.parseWindDirection(windDirection);
    }
  },{
    selected: null as any as ISimulation | null
  },
  {
    addSimulation(name:string, scenario:IWeatherScenarioSpec): ISimulation {
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
      const found = _.find(this.simulations.values(), (s: ISimulation) => s.name === name);
      return found ? this.selected = found : null;
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

export const simulationStore = SimulationStore.create();

Firebasify(simulationStore,"Simulations");
