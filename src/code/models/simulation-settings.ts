import { types } from "mobx-state-tree";
import { v1 as uuid } from "uuid";
import { PredictionType } from "../models/prediction";

enum TempUnits {
  Celsius = "C",
  Fahrenheit = "F"
}

enum WindSpeedUnits {
  KPH = "kph",
  MPH = "mph"
}

export type IFormatTempOptions = {
  precision?: number,
  withDegree?: boolean,
  withDegreeUnit?: boolean,
  asDifference?: boolean
};

export type IFormatWindSpeedOptions = {
  precision?: number,
  withUnit?: boolean
};

const kMetersPerSecToMPH = 2.23694,
      kMetersPerSecToKPH = 3.6;

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
  windSpeedUnit: types.optional(types.enumeration("WindUnit",
                                              [WindSpeedUnits.KPH, WindSpeedUnits.MPH]),
                                              WindSpeedUnits.MPH),
  showStationNames: types.optional(types.boolean, true),
  showPredictions: types.optional(types.boolean, true),
  enabledPredictions: types.maybe(types.string),  // null disables predictions
  predictionInterval: types.optional(types.number, 60), // minutes

  formatTemperature(temp: number, options?: IFormatTempOptions): string {
    if ((temp == null) || !isFinite(temp)) { return ""; }
    const o = options || {},
          d = o.asDifference ? 0 : 32,
          t = this.tempUnit === TempUnits.Fahrenheit ? temp * 9 / 5 + d : temp;
    let s = t.toFixed(o.precision || 0);

    // eliminate "-0"
    if (s === "-0") { s = "0"; }
    // format positive differences with '+'
    if (o.asDifference && (s !== "0") && (s[0] !== '-')) {
      s = '+' + s;
    }
    return s
            + (o.withDegree ? "°" : "")
            + (o.withDegreeUnit ? `°${this.tempUnit}` : "");
  },

  parseTemperature(temp: string): number | null {
    const t = parseFloat(temp);
    if ((t == null) || !isFinite(t)) { return null; }
    // convert to Celsius for internal storage
    return this.tempUnit === TempUnits.Fahrenheit ? (t - 32) * 5 / 9 : t;
  },

  get windSpeedConversion() {
    return this.windSpeedUnit === WindSpeedUnits.KPH
            ? kMetersPerSecToKPH : kMetersPerSecToMPH;
  },

  formatWindSpeed(windSpeed: number, options?: IFormatWindSpeedOptions): string {
    if ((windSpeed == null) || !isFinite(windSpeed)) { return ""; }
    const w = windSpeed * this.windSpeedConversion,
          o = options || {};
    return `${w.toFixed(o.precision || 0)}${o.withUnit ? ' ' + this.windSpeedUnit : ''}`;
  },

  parseWindSpeed(windSpeed: string): number | null {
    const w = parseFloat(windSpeed);
    if ((w == null) || !isFinite(w)) { return null; }
    return w / this.windSpeedConversion;
  },

  formatWindDirection(windDirection: number, options?: IFormatWindSpeedOptions): string {
    if ((windDirection == null) || !isFinite(windDirection)) { return ""; }
    const w = windDirection,
          o = options || {};
    return `${w.toFixed(o.precision || 0)}`;
  },

  parseWindDirection(windDirection: string): number | null {
    const w = parseFloat(windDirection);
    if ((w == null) || !isFinite(w)) { return null; }
    return w;
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
