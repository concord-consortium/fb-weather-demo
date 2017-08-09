import { types } from "mobx-state-tree";
import { SimulationSettings, ISimulationSettings } from "./simulation-settings";
import { gWeatherEvent } from "./weather-event";
import { theWeatherScenario } from "./weather-scenario";
import { WeatherScenario, IWeatherScenario, IStationSpec } from "./weather-scenario";
import { WeatherStation } from "./weather-station";
import { PresenceStore } from "../stores/presence-store";
import { WeatherStationStore } from "../stores/weather-station-store";
import { PredictionStore } from "../stores/prediction-store";
import { v1 as uuid } from "uuid";

import * as _ from "lodash";
import * as moment from 'moment';

export const Simulation = types.model('Simulation', {
  name: types.string,
  id: types.optional(types.identifier(types.string), () => uuid()),
  scenario: types.optional(WeatherScenario, theWeatherScenario),
  presences: types.optional(PresenceStore,      () => PresenceStore.create()),
  predictions: types.optional(PredictionStore,  () => PredictionStore.create()),
  stations: types.optional(WeatherStationStore, () => WeatherStationStore.create()),
  settings: types.optional(SimulationSettings,  () => SimulationSettings.create()),
  isPlaying: types.optional(types.boolean, false),
  simulationTime: types.optional(types.maybe(types.Date), theWeatherScenario.startTime),
  simulationSpeed: types.optional(types.number,1),

  get timeString() {
    // formatting rules see: https://momentjs.com/
    return moment(this.simulationTime).format('lll');
  },
  get mapConfig() {
    return this.scenario && this.scenario.mapConfig;
  }
}, {
}, {
  afterCreate() {
    const stations = _.map(this.scenario.stations, (spec: IStationSpec) => {
                        return WeatherStation.create({
                                  name: spec.name,
                                  imageUrl: spec.imageUrl,
                                  id: spec.id,
                                  callsign: spec.id
                                });
                      });
    stations.forEach((station) => {
      gWeatherEvent.stationData(station.id)
        .then((stationData: any) => {
          station.setLocation({ lat: stationData.lat, long: stationData.long });

          if (!this.simulationTime) {
            this.setSimulationTime(gWeatherEvent.startTime);
          }
        })
        .catch((err: any) => {
          console.log(`Error initializing weather stations: ${err}`);
        });
    });
    this.stations.addStations(stations);
  },
  setSimulationTime(time: Date) {
    this.simulationTime = time;
  },
  play() {
    this.isPlaying = true;
  },
  stop() {
    this.isPlaying = false;
  },
  setPref(key: string, value: any) {
    this.settings.setSetting(key, value);
  },
  preProcessSnapshot(snapshot:any) {
    if (!snapshot.predictions) {
      snapshot.predictions = {predictions: []};
    }
    if (!snapshot.stations) {
      snapshot.stations = {stations:[]};
    }
    return snapshot;
  }
});
export type ISimulation = typeof Simulation.Type;
