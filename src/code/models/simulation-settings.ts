import { types } from "mobx-state-tree";
import { v4 as uuid } from "uuid";
import { PredictionType } from "../models/prediction";
import * as moment from "moment";
import { TemperatureUnit } from "./temperature";

enum WindSpeedUnits {
  KPH = "kph",
  MPH = "mph"
}

export type IFormatTempOptions = {
  precision?: number,
  withDegree?: boolean,
  withUnit?: boolean,
  asDifference?: boolean
};

export type IFormatWindSpeedOptions = {
  precision?: number,
  withUnit?: boolean
};

const kMetersPerSecToMPH = 2.23694,
      kMetersPerSecToKPH = 3.6,
      // hard-coded defaults that override restored values
      kOverrides = { tempUnit: TemperatureUnit.Celsius, showCities: true };

export const SimulationSettings = types
  .model('SimulationSettings', {
    id: types.optional(types.identifier(types.string), () => uuid()),
    showBaseMap: types.optional(types.boolean, true),
    interpolationEnabled: types.optional(types.boolean, true),
    showTempColors: types.optional(types.boolean, false),
    showTempValues: types.optional(types.boolean, true),
    showDeltaTemp: types.optional(types.boolean, false),
    tempUnit: types.optional(types.enumeration("TempUnit",
                                                [TemperatureUnit.Celsius, TemperatureUnit.Fahrenheit]),
                                                kOverrides.tempUnit),
    showWindValues: types.optional(types.boolean, true),
    windSpeedUnit: types.optional(types.enumeration("WindUnit",
                                                [WindSpeedUnits.KPH, WindSpeedUnits.MPH]),
                                                WindSpeedUnits.MPH),
    showStationNames: types.optional(types.boolean, true),
    showPredictions: types.optional(types.boolean, true),
    enabledPredictions: types.maybe(types.string),  // null disables predictions
    predictionInterval: types.optional(types.number, 60), // minutes
    showCities: types.optional(types.boolean, kOverrides.showCities)
  })
  .views(self => {

    const localUtcOffset = -(new Date().getTimezoneOffset());

    function _windSpeedConversion() {
      return self.windSpeedUnit === WindSpeedUnits.KPH
              ? kMetersPerSecToKPH : kMetersPerSecToMPH;
    }

    return {
      formatLocalTime(time: Date | null, format?: string): string {
        if (time == null) { return ""; }
        return moment(time).utcOffset(localUtcOffset).format(format || 'HH:mm' || 'lll');
      },

      formatTemperature(temp: number, options?: IFormatTempOptions): string {
        if ((temp == null) || !isFinite(temp)) { return ""; }
        const o = options || {},
              d = o.asDifference ? 0 : 32,
              t = self.tempUnit === TemperatureUnit.Fahrenheit ? temp * 9 / 5 + d : temp;
        let s = t.toFixed(o.precision || 0);

        // eliminate "-0"
        if (s === "-0") { s = "0"; }
        // format positive differences with '+'
        if (o.asDifference && (s !== "0") && (s[0] !== '-')) {
          s = '+' + s;
        }
        return s
                + (o.withDegree ? "°" : "")
                + (o.withUnit ? `°${self.tempUnit}` : "");
      },

      parseTemperature(temp: string): number | null {
        const t = parseFloat(temp);
        if ((t == null) || !isFinite(t)) { return null; }
        // convert to Celsius for internal storage
        return self.tempUnit === TemperatureUnit.Fahrenheit ? (t - 32) * 5 / 9 : t;
      },

      formatWindSpeed(windSpeed: number, options?: IFormatWindSpeedOptions): string {
        if ((windSpeed == null) || !isFinite(windSpeed)) { return ""; }
        const w = windSpeed * _windSpeedConversion(),
              o = options || {};
        return `${w.toFixed(o.precision || 0)}${o.withUnit ? ' ' + self.windSpeedUnit : ''}`;
      },

      parseWindSpeed(windSpeed: string): number | null {
        const w = parseFloat(windSpeed);
        if ((w == null) || !isFinite(w)) { return null; }
        return w / _windSpeedConversion();
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
    };
  })
  .preProcessSnapshot(snapshot =>
    // replace restored values with new hard-coded values
    Object.assign({}, snapshot, kOverrides)
  )
  .actions(self => ({
    setShowBaseMap(showBaseMap: boolean) {
      self.showBaseMap = showBaseMap;
    },

    setShowTempColors(showTempColors: boolean) {
      self.showTempColors = showTempColors;
    },

    setShowTempValues(showTempValues: boolean) {
      self.showTempValues = showTempValues;
      if (!showTempValues && (self.enabledPredictions === PredictionType.eTemperature)) {
        self.enabledPredictions = null;
      }
    },

    setShowDeltaTemp(showDeltaTemp: boolean) {
      self.showDeltaTemp = showDeltaTemp;
    },

    setShowWindValues(showWindValues: boolean) {
      self.showWindValues = showWindValues;
      if (!showWindValues && ((self.enabledPredictions === PredictionType.eWindSpeed) ||
                              (self.enabledPredictions === PredictionType.eWindDirection))) {
        self.enabledPredictions = null;
      }
    },

    setShowStationNames(showStationNames: boolean) {
      self.showStationNames = showStationNames;
    },

    setShowPredictions(showPredictions: boolean) {
      self.showPredictions = showPredictions;
    },

    setEnabledPredictions(enabledPredictions: string) {
      self.enabledPredictions = enabledPredictions;
    },

    setPredictionInterval(predictionInterval: number) {
      self.predictionInterval = predictionInterval;
    },

    setShowCities(showEm:boolean) {
      self.showCities = showEm;
    }
  }))
  .actions(self => ({
    setSetting(key: string, value: any) {
      switch(key) {
        case 'showBaseMap': self.setShowBaseMap(value as boolean); break;
        case 'showTempColors': self.setShowTempColors(value as boolean); break;
        case 'showTempValues': self.setShowTempValues(value as boolean); break;
        case 'showWindValues': self.setShowWindValues(value as boolean); break;
        case 'showDeltaTemp': self.setShowDeltaTemp(value as boolean); break;
        case 'showStationNames': self.setShowStationNames(value as boolean); break;
        case 'showPredictions': self.setShowPredictions(value as boolean); break;
        case 'enabledPredictions': self.setEnabledPredictions(value as string); break;
        case 'predictionInterval': self.setPredictionInterval(value as number); break;
        case 'showCities': self.setShowCities(value as boolean); break;
        default:
          console.log(`Invalid setting name: '${key}'`);
      }
    }
  }));
export type ISimulationSettings = typeof SimulationSettings.Type;
