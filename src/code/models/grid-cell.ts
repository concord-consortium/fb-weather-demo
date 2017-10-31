import { types } from "mobx-state-tree";
import { WeatherStation } from "./weather-station";
import { v1 as uuid } from "uuid";

export const rowName = (n:number) => String.fromCharCode(65 + n);
export const colName = (n:number) => n + 1;
export const cellName = (row:number, column:number) => `${rowName(row)}-${colName(column)}`;

export const GridCell = types.model('GridCell', {
  id: types.optional(types.identifier(types.string), ()=> uuid()),
  row: types.number,
  column: types.number,
  weatherStation: WeatherStation,
  get columnName() {
    return colName(this.column);
  },
  get rowName() {
    return rowName(this.row);
  },
  get displayName() {
    return cellName(this.row, this.column);
  }
}, {
  // volatile
}, {
});
export type IGridCell = typeof GridCell.Type;
