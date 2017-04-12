import {observable, computed } from "mobx";
import { v1 as uuid } from "uuid";

export class GridFormat {
  @observable id: string
  @observable name: string
  @observable columns: number
  @observable rows: number
  constructor() {
    this.id = uuid();
    this.name = "set name";
    this.columns=0;
    this.rows=0;
  }
}

export interface GridFormatMap {
  [id:string]: GridFormat
}

export const NullGridFormat=new GridFormat();

export class Grid {
  data: number[]
  columnCount: number
  rowCount: number

  constructor(format:GridFormat=NullGridFormat, data:number[]=[]) {
    this.columnCount = format.columns;
    this.rowCount = format.rows;
    this.data = data;
  }

  _index(row:number, column:number) {
    return row * this.columnCount + column;
  }

  get(row:number, column:number) {
    return this.data[this._index(row,column)];
  }

  set(row:number, column:number, value:number) {
    this.data[this._index(row,column)] = value;
  }

}