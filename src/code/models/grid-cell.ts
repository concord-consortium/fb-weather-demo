import { types } from "mobx-state-tree";
import { v4 as uuid } from "uuid";

export const rName = (n:number) => String(n + 1);
export const cName = (n:number) => String.fromCharCode(65 + n);
export const cellName = (row:number, column:number) => `${cName(column)}-${rName(row)}`;

export const GridCell = types
  .model('GridCell', {
    id: types.optional(types.identifier(types.string), () => uuid()),
    row: types.number,
    column: types.number,
    weatherStationId: types.string
  })
  .views(self => ({
    get columnName() {
      return cName(self.column);
    },
    get rowName() {
      return rName(self.row);
    },
    get displayName() {
      return cellName(self.row, self.column);
    }
  }));
export type IGridCell = typeof GridCell.Type;
