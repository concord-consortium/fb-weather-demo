// import CsvParse from "csv-parse";
const CsvParse = require("csv-parse/lib/sync");
const _ = require("lodash");

import DefaultCSV from "./default-weather-data";
import { Kriging } from "./kriging";

export class FrameHelper {
  constructor() {
    this.frames = [];
  }

  parse(data = DefaultCSV) {
    const records = CsvParse(data, { auto_parse: true, columns: true });
    this.loadData(records);
  }

  loadData(records) {
    if (records) {
      const timeSlice = 1000 * 60 * 60;
      const grouped = _.groupBy(records, item => {
        return Math.floor(Date.parse(item.DATE) / timeSlice);
      });
      const frames = _.map(grouped, function(value, key) {
        const stations = _.uniqBy(value, "STATION");
        const time = parseInt(key, 10) * timeSlice;
        return { time: time, stations: stations };
      });
      this.frames = frames;
      this.makeAllFames(16, 16);
      this.makeAllFames(5, 5, "classGrid");
      console.log(this.extents());
      console.log(this.geoJSON(0));
    } else {
      console.error("Could not load data in frame-helper");
    }
  }
  // return the bounding rectangle of the stations.
  // assumes that all the stations are in the first frame.
  // assumes data is loaded and parsed into frames.
  // default padding of 1/10 of a degree is added
  extents(marginDegree = 0.1) {
    const stations = this.frames[0].stations;
    const maxLat = _.maxBy(stations, "LATITUDE").LATITUDE;
    const maxLon = _.maxBy(stations, "LONGITUDE").LONGITUDE;
    const minLat = _.minBy(stations, "LATITUDE").LATITUDE;
    const minLon = _.minBy(stations, "LONGITUDE").LONGITUDE;
    const width = maxLon - minLon;
    const height = maxLat - minLat;
    return {
      x: minLon - marginDegree,
      y: minLat - marginDegree,
      width: width + 2 * marginDegree,
      height: height + 2 * marginDegree
    };
  }

  // generate interpolated grid centers
  makeGrid(nCols, nRows, frame = 0) {
    const ext = this.extents();
    const cellWidth = ext.width / nCols;
    const cellHeight = ext.height / nRows;

    const getGridPos = station => {
      const x = Math.floor((station.LONGITUDE - ext.x) / cellWidth);
      const y = Math.floor((station.LATITUDE - ext.y) / cellHeight);
      return { x: x, y: y };
    };

    // train data with weatherStation Data:
    const tmps = _.map(this.frames[frame].stations, s => s.HOURLYDRYBULBTEMPF);
    const xs = _.map(this.frames[frame].stations, s => getGridPos(s).x);
    const ys = _.map(this.frames[frame].stations, s => getGridPos(s).y);
    const data = {
      values: tmps,
      xs: xs,
      ys: ys
    };
    const kriging = Kriging();
    const model = kriging.train(
      data.values,
      data.xs,
      data.ys,
      "gaussian",
      0,
      100
    );
    const rows = [];

    let cols, x, y;

    for (x = 0; x < nRows; x++) {
      cols = [];
      for (y = 0; y < nCols; y++) {
        cols.push(kriging.predict(x, y, model));
      }
      rows.push(cols.slice());
    }
    return rows;
  }

  makeAllFames(cols, rows, name = "default") {
    const makeGrid = this.makeGrid.bind(this);
    for (let i = 0; i < this.frames.length; i++) {
      // there is one frame with only one station (??)
      if (this.frames[i].stations.length > 1) {
        this.frames[i].grids = this.frames[i].grids || {};
        this.frames[i].grids[name] = makeGrid(cols, rows, i);
      }
    }
  }
  geoJSON(frameNumber) {
    const features = _.map(this.frames[frameNumber].stations, s => {
      return {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [s.LATITUDE, s.LONGITUDE]
        },
        properties: {
          temp: s.HOURLYDRYBULBTEMPF
        }
      };
    });
    const data = {
      type: "FeatureCollection",
      features: features
    };
    return JSON.stringify(data);
  }
}
