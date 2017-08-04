import { types } from "mobx-state-tree";

export const SimulationSettings = types.model('SimulationSettings', {
  showBaseMap: types.optional(types.boolean, true),
  showTempColors: types.optional(types.boolean, false),
  showTempValues: types.optional(types.boolean, true),
  showDeltaTemp: types.optional(types.boolean, false),
  showStationNames: types.optional(types.boolean, true),
  showPredictions: types.optional(types.boolean, true),
  enabledPredictions: types.optional(types.string, 'disabled'),
  mapConfig: types.maybe(types.string)
}, {

  setSetting(key: string, value: any) {
    switch(key) {
      case 'showBaseMap': this.setShowBaseMap(value as boolean); break;
      case 'showTempColors': this.setShowTempColors(value as boolean); break;
      case 'showTempValues': this.setShowTempValues(value as boolean); break;
      case 'showDeltaTemp': this.setShowDeltaTemp(value as boolean); break;
      case 'showStationNames': this.setShowStationNames(value as boolean); break;
      case 'showPredictions': this.setShowPredictions(value as boolean); break;
      case 'enabledPredictions': this.setEnabledPredictions(value as string); break;
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
  },

  setShowDeltaTemp(showDeltaTemp: boolean) {
    this.showDeltaTemp = showDeltaTemp;
  },

  setShowStationNames(showStationNames: boolean) {
    this.showStationNames = showStationNames;
  },

  setShowPredictions(showPredictions: boolean) {
    this.showPredictions = showPredictions;
  },

  setEnabledPredictions(enabledPredictions: string) {
    this.enabledPredictions = enabledPredictions;
  }

});
export type ISimulationSettings = typeof SimulationSettings.Type;
