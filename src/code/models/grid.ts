import { types } from "mobx-state-tree";
import { cellName, GridCell } from "./grid-cell";
import { WeatherStation } from "./weather-station";
import { IWeatherStationStore } from "../stores/weather-station-store";

import { v4 as uuid } from "uuid";

// const gridSizeInDegrees = 1;
const defaultNumRows = 7;
const defaultNumColumns = 7;

export const Grid = types
  .model('Grid', {
    id: types.optional(types.identifier(types.string), ()=> uuid()),
    cellMap: types.optional(types.map(GridCell), {}),
    columns: types.optional(types.number, defaultNumColumns),
    rows: types.optional(types.number, defaultNumRows)
  })
  .volatile(self => ({
    stationStore: null as (IWeatherStationStore | null)
  }))
  .views(self => ({
    gridCellAt(row:number, column:number) {
      const key=cellName(row,column);
      return self.cellMap.get(key);
    }
  }))
  .views(self => ({
    stationAt(row:number, column:number) {
      const gridCell = self.gridCellAt(row,column),
            stationId = gridCell && gridCell.weatherStationId,
            store = self.stationStore;
      return store && stationId && store.getStationByID(stationId);
    },
  }))
  .actions(self => ({
    createCells(stationStore: IWeatherStationStore) {
      if (stationStore) { self.stationStore = stationStore; }
      if (!(self.stationStore)) { return; }
      const {rows, columns}  = self;
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
          self.stationStore.addStation(weatherStation);
          self.cellMap.put(GridCell.create( {
            id: gridId,
            column: column,
            row: row,
            weatherStationId: weatherStation.id
          }));
        }
      }
    }
  }))
  .actions(self => ({
    setRows(n:number) {
      if(n && n >= 0) {
        self.rows = n;
        if (self.stationStore) {
          self.createCells(self.stationStore);
        }
      }
    },
    setColumns(n:number) {
      if(n && n >= 0) {
        self.columns = n;
        if (self.stationStore) {
          self.createCells(self.stationStore);
        }
      }
    }
  }));
export type IGrid = typeof Grid.Type;
