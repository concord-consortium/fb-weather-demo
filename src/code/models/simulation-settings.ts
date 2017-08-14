import { types } from "mobx-state-tree";
import { v1 as uuid } from "uuid";
import { PredictionType } from "../models/prediction";

enum TempUnits {
  Celsius = "C",
  Fahrenheit = "F"
}

export type IFormatTempOptions = {
  precision?: number,
  withDegree?: boolean,
  withDegreeUnit?: boolean
};

export const SimulationSettings = types.model('SimulationSettings', {
  id: types.optional(types.identifier(types.string), () => uuid()),
  showBaseMap: types.optional(types.boolean, true),
  showTempColors: types.optional(types.boolean, false),
  showTempValues: types.optional(types.boolean, true),
  showDeltaTemp: types.optional(types.boolean, false),
  tempUnit: types.optional(types.enumeration("TempUnit",
                                              [TempUnits.Celsius, TempUnits.Fahrenheit]),
                                              TempUnits.Fahrenheit),
  showWindValues: types.optional(types.boolean, true),
  showStationNames: types.optional(types.boolean, true),
  showPredictions: types.optional(types.boolean, true),
  enabledPredictions: types.maybe(types.string),  // null disables predictions
  predictionInterval: types.optional(types.number, 60), // minutes

  formatTemperature(temp: number, options?: IFormatTempOptions): string {
    if ((temp == null) || !isFinite(temp)) { return ""; }
    const t = this.tempUnit === TempUnits.Fahrenheit ? temp * 9 / 5 + 32 : temp,
          o = options || {};
    return t.toFixed(o.precision || 0)
            + (o.withDegree ? "°" : "")
            + (o.withDegreeUnit ? `°${this.tempUnit}` : "");
  }
}, {

  setSetting(key: string, value: any) {
    switch(key) {
      case 'showBaseMap': this.setShowBaseMap(value as boolean); break;
      case 'showTempColors': this.setShowTempColors(value as boolean); break;
      case 'showTempValues': this.setShowTempValues(value as boolean); break;
      case 'showWindValues': this.setShowWindValues(value as boolean); break;
      case 'showDeltaTemp': this.setShowDeltaTemp(value as boolean); break;
      case 'showStationNames': this.setShowStationNames(value as boolean); break;
      case 'showPredictions': this.setShowPredictions(value as boolean); break;
      case 'enabledPredictions': this.setEnabledPredictions(value as string); break;
      case 'predictionInterval': this.setPredictionInterval(value as number); break;
      default:
        console.log(`Invalid setting name: '${key}'`);
    }
  },

  setShowBaseMap(showBaseMap: boolean) {
    this.showBaseMap = showBaseMap;
  },

  setShowTempColors(showTempColors: boolean) {
    this.showTempColors = showTempColors;
  },

  setShowTempValues(showTempValues: boolean) {
    this.showTempValues = showTempValues;
    if (!showTempValues && (this.enabledPredictions === PredictionType.eTemperature)) {
      this.enabledPredictions = null;
    }
  },

  setShowDeltaTemp(showDeltaTemp: boolean) {
    this.showDeltaTemp = showDeltaTemp;
  },

  setShowWindValues(showWindValues: boolean) {
    this.showWindValues = showWindValues;
    if (!showWindValues && ((this.enabledPredictions === PredictionType.eWindSpeed) ||
                            (this.enabledPredictions === PredictionType.eWindDirection))) {
      this.enabledPredictions = null;
    }
  },

  setShowStationNames(showStationNames: boolean) {
    this.showStationNames = showStationNames;
  },

  setShowPredictions(showPredictions: boolean) {
    this.showPredictions = showPredictions;
  },

  setEnabledPredictions(enabledPredictions: string) {
    this.enabledPredictions = enabledPredictions;
  },

  setPredictionInterval(predictionInterval: number) {
    this.predictionInterval = predictionInterval;
  }
});
export type ISimulationSettings = typeof SimulationSettings.Type;
