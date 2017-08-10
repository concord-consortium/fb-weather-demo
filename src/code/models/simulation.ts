import { types } from "mobx-state-tree";
import { SimulationControl } from "./simulation-control";
import { SimulationSettings } from "./simulation-settings";
import { gWeatherEvent } from "./weather-event";
import { theWeatherScenario } from "./weather-scenario";
import { WeatherScenario, IStationSpec } from "./weather-scenario";
import { WeatherStation, IWeatherStation } from "./weather-station";
import { WeatherStationState } from "./weather-station-state";
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
  control: types.optional(SimulationControl,    () => SimulationControl.create()),
  settings: types.optional(SimulationSettings,  () => SimulationSettings.create()),
  presences: types.optional(PresenceStore,      () => PresenceStore.create()),
  predictions: types.optional(PredictionStore,  () => PredictionStore.create()),
  stations: types.optional(WeatherStationStore, () => WeatherStationStore.create()),

  get isPlaying() {
    return this.control.isPlaying;
  },
  get time() {
    return this.control.time;
  },
  get timeString() {
    // formatting rules see: https://momentjs.com/
    return moment(this.time).format('lll');
  },
  get mapConfig() {
    return this.scenario && this.scenario.mapConfig;
  }
}, {
}, {
  afterCreate() {
    this.presences.initPresence();

    if (_.size(this.stations.stations) === 0) {
      // create stations from scenario
      const stations = this.scenario.stations.map((spec: IStationSpec) => {
                          return WeatherStation.create({
                                    name: spec.name,
                                    imageUrl: spec.imageUrl,
                                    id: uuid(),
                                    callSign: spec.id
                                  });
                        });
      this.stations.addStations(stations);
    }

    // initialize stations from WeatherEvent
    this.stations.stations.forEach((station: IWeatherStation) => {
      gWeatherEvent.stationData(station.callSign)
        .then((stationData: any) => {
          if ((station.lat == null) || (station.long == null)) {
            station.setLocation({ lat: stationData.lat, long: stationData.long });
          }

          if (!this.time) {
            this.setTime(gWeatherEvent.startTime);
          }

          station.setState(new WeatherStationState(stationData, this.control));
        })
        .catch((err: any) => {
          console.log(`Error initializing weather station '${station.id}': ${err}`);
        });
    });
  },

  // SimulationControl wrappers
  setTime(time: Date) {
    this.control.setTime(time);
  },
  play() {
    this.control.play();
  },
  stop() {
    this.control.stop();
  },

  setPref(key: string, value: any) {
    this.settings.setSetting(key, value);
  }
});
export type ISimulation = typeof Simulation.Type;
