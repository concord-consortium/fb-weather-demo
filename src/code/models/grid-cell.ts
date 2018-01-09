import { types } from "mobx-state-tree";
import { v1 as uuid } from "uuid";

export const rowName = (n:number) => String(n + 1);
export const colName = (n:number) => String.fromCharCode(65 + n);
export const cellName = (row:number, column:number) => `${colName(column)}-${rowName(row)}`;

export const GridCell = types.model('GridCell', {
  id: types.optional(types.identifier(types.string), ()=> uuid()),
  row: types.number,
  column: types.number,
  weatherStationId: types.string,
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
