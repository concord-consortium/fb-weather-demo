import { types } from "mobx-state-tree";
import { cellName, GridCell } from "./grid-cell";
import { WeatherStation } from "./weather-station";
import { IWeatherStationStore } from "../stores/weather-station-store";

import { v1 as uuid } from "uuid";

// const gridSizeInDegrees = 1;
const defaultNumRows = 7;
const defaultNumColumns = 7;

export const Grid = types.model('Grid', {
  // Properties
  id: types.optional(types.identifier(types.string), ()=> uuid()),
  gridCells: types.optional(types.array(GridCell), []),
  columns: types.optional(types.number, defaultNumColumns),
  rows: types.optional(types.number, defaultNumRows)
}, {
  stationStore: null,
}, {

  createCells(stationStore: IWeatherStationStore) {
    if (stationStore) { this.stationStore = stationStore; }
    if (!(this.stationStore)) { return; }
    const {rows,columns}  = this;
    for(let row = 0; row < rows; row++) {
      for(let column = 0; column < columns; column++) {
        // const lon = (column * gridSizeInDegrees) + (0.5 * gridSizeInDegrees);
        // const lat = (row * gridSizeInDegrees) + (0.5 * gridSizeInDegrees);
        const callSign = cellName(row,column);
        const gridId = callSign;
        const weatherStation = WeatherStation.create({
          name: callSign,
          callSign: callSign,
          id: callSign,
          imageUrl: "",
          // lat: lat,
          // long: lon
        });
        this.stationStore.addStation(weatherStation);
        this.gridCells.push(GridCell.create( {
          id: gridId,
          column: column,
          row: row,
          weatherStationId: weatherStation.id
        }));
      }
    }
  },

  gridCellAt(row:number, column:number) {
    const index = row * this.columns + column;
    return this.gridCells[index];
  },
  stationAt(row:number, column:number) {
    const stationId = this.gridCellAt(row,column).weatherStationId;
    if(this.stationStore) {
      return this.stationStore.getStationByID(stationId);
    }
  },
  setRows(n:number) {
    if(n && n >= 0) {
      this.rows = n;
      this.createCells(this.stationStore);
    }
  },
  setColumns(n:number) {
    if(n && n >= 0) {
      this.columns = n;
      this.createCells(this.stationStore);
    }
  }
});
export type IGrid = typeof Grid.Type;
