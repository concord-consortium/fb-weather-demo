import { types } from "mobx-state-tree";
import { cellName, GridCell, IGridCell } from "./grid-cell";
import { WeatherStation } from "./weather-station";
import { v1 as uuid } from "uuid";

const gridSizeInDegrees = 1;
const defaultNumRows = 7;
const defaultNumColumns = 7;

function createCells(rows:number, columns:number) {
  const cells:IGridCell[] = [];

  for(let row = 0; row < rows; row++) {
    for(let column = 0; column < columns; column++) {
      const lon = (column * gridSizeInDegrees) + (0.5 * gridSizeInDegrees);
      const lat = (row * gridSizeInDegrees) + (0.5 * gridSizeInDegrees);
      const callSign = cellName(row,column);
      const gridId = callSign;
      const weatherStation = WeatherStation.create({
        name: callSign,
        callSign: callSign,
        id: callSign,
        imageUrl: "",
        lat: lat,
        long: lon
      });
      cells.push(GridCell.create( {
        id: gridId,
        column: column,
        row: row,
        weatherStation: weatherStation
      }));
    }
  }
  return cells;
}

export const Grid = types.model('Grid', {
  // Properties
  id: types.optional(types.identifier(types.string), ()=> uuid()),
  gridCells: types.optional(types.array(GridCell), () => createCells(this.rows, this.columns)),
  columns: types.optional(types.number, defaultNumColumns),
  rows: types.optional(types.number, defaultNumRows)
}, {
  // Colatile
}, {
  // Actions
  afterCreate() {
    this.createCells();
  },
  createCells() {
    this.gridCells = createCells(this.rows, this.columns);
  },
  gridCellAt(row:number, column:number) {
    const index = row * this.columns + column;
    return this.gridCells[index];
  },
  stationAt(row:number, column:number) {
    return this.gridCellAt(row,column).weatherStation;
  },
  setRows(n:number) {
    if(n && n >= 0) {
      this.rows = n;
      this.createCells();
    }
  },
  setColumns(n:number) {
    if(n && n >= 0) {
      this.columns = n;
      this.createCells();
    }
  }
});
export type IGrid = typeof Grid.Type;
