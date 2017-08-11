import { computed } from "mobx";
import { ISimulationControl } from "./simulation-control";
import * as _ from "lodash";

export const kDefaultPrecision = {
              temperature: 0,
              windSpeed: 1,
              windDirection: 0
            };

export class WeatherStationState {
  simulation: ISimulationControl;
  stationData: any;
  colIndices: { [key: string]: number; };

  constructor(stationData: any, simulation: ISimulationControl) {
    this.stationData = stationData;
    this.simulation = simulation;

    this.colIndices = {};
    stationData.cols.forEach((name: string, index: number) => {
                      this.colIndices[name.toLowerCase()] = index;
                    });
    // map Google Sheet names to internal names
    const nameMap = {
            temperature: "air_temperature",
            windSpeed: "wind_speed",
            windDirection: "wind_from_direction",
            barometricPressure: "inches_altim",
            dewPointTemperature: "dew_point_temperature",
            cloudCover: "cloud_area_fraction",
            hourlyPrecipitation: "precipitation_amount_hourly",
            dailyPrecipitation: "precipitation_amount_24"
          };
    _.each(nameMap, (oldName: string, newName: string) => {
      if ((oldName !== newName) && (this.colIndices[oldName]) != null) {
        this.colIndices[newName] = this.colIndices[oldName];
      }
    });
  }

  @computed
  get indices() {
    const time = this.simulation.time;
    if (!this.stationData || (time == null)) { return null; }

    const colCount = this.stationData.cols.length,
          rowCount = this.stationData.rows.length,
          pseudoRow = _.fill(Array(colCount), time),
          insertIndex = _.sortedIndexBy(this.stationData.rows, pseudoRow, (row: any[]) => {
            return row[this.colIndices.time];
          }),
          highIndex = insertIndex < rowCount ? insertIndex : rowCount - 1,
          highRow = this.stationData.rows[highIndex],
          lowIndex = (highIndex > 0) && (highRow[this.colIndices.time] > time) ? highIndex - 1 : highIndex;
    return { low: lowIndex, high: highIndex };
  }

  @computed
  get pctInterpolate() {
    const indices = this.indices,
          simTime = this.simulation.time;
    if (!indices || !simTime) { return null; }

    const lowTime = this.stationData.rows[indices.low][this.colIndices.time].getTime(),
          highTime = this.stationData.rows[indices.high][this.colIndices.time].getTime(),
          timeInterval = highTime - lowTime;
    return timeInterval ? (simTime.getTime() - lowTime) / timeInterval : 0;
  }

  interpolate(colIndex: number): number | null {
    const indices = this.indices,
          pctInterpolate = this.pctInterpolate;
    if (!indices || (pctInterpolate == null)) { return null; }

    const lowValue = this.stationData.rows[indices.low][colIndex],
          highValue = this.stationData.rows[indices.high][colIndex],
          isLowNum = isFinite(lowValue),
          isHighNum = isFinite(highValue);
    if (isLowNum && isHighNum) {
      return lowValue + pctInterpolate * (highValue - lowValue);
    }
    if (isLowNum) { return lowValue; }
    if (isHighNum) { return highValue; }
    return null;
  }

  interpolateAngles(colIndex: number): number | null {
    const indices = this.indices,
          pctInterpolate = this.pctInterpolate;
    if (!indices || (pctInterpolate == null)) { return null; }

    let lowValue = this.stationData.rows[indices.low][colIndex],
        highValue = this.stationData.rows[indices.high][colIndex],
        isLowNum = isFinite(lowValue),
        isHighNum = isFinite(highValue);
    if (isLowNum) { lowValue %= 360; }
    if (isHighNum) { highValue %= 360; }
    if (isLowNum && isHighNum) {
      let diffValue = highValue - lowValue;
      // map to +/- 180
      if (diffValue < -180) { diffValue += 360; }
      if (diffValue > 180) { diffValue -= 360; }
      let result = lowValue + pctInterpolate * diffValue;
      if (result < 0) { result += 360; }
      if (result > 360) { result -= 360; }
      console.log(`lo: ${lowValue}, hi: ${highValue}, result: ${result}`);
      return result;
    }
    if (isLowNum) { return lowValue; }
    if (isHighNum) { return highValue; }
    return null;
  }

  @computed
  get temperature() {
    return this.interpolate(this.colIndices.temperature);
  }

  strTemperature(precision = kDefaultPrecision.temperature) {
    const t = this.temperature,
          s = t && isFinite(t) ? t.toFixed(precision) : "";
    return s === "-0" ? "0" : s;
  }

  @computed
  get windSpeed() {
    return this.interpolate(this.colIndices.windSpeed);
  }

  strWindSpeed(precision = kDefaultPrecision.windSpeed) {
    const s = this.windSpeed;
    return s && isFinite(s) ? s.toFixed(precision) : "";
  }

  @computed
  get windDirection() {
    return this.interpolateAngles(this.colIndices.windDirection);
  }

  strWindDirection(precision = kDefaultPrecision.windDirection) {
    const d = this.windDirection;
    return d && isFinite(d) ? d.toFixed(precision) : "";
  }

  @computed
  get barometricPressure() {
    return this.interpolate(this.colIndices.barometricPressure);
  }

  @computed
  get dewPointTemperature() {
    return this.interpolate(this.colIndices.dewPointTemperature);
  }

  strDewPointTemperature(precision = kDefaultPrecision.temperature) {
    const t = this.dewPointTemperature;
    return t && isFinite(t) ? t.toFixed(precision) : "";
  }

  @computed
  get hourlyPrecipitation() {
    return this.interpolate(this.colIndices.hourlyPrecipitation);
  }

  @computed
  get dailyPrecipitation() {
    return this.interpolate(this.colIndices.dailyPrecipitation);
  }
}
