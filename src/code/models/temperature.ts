const fToC = (f: number, delta = 32) => (f - delta) * (5/9);
const cToF = (c: number, delta = 32) => (c * (9/5)) + delta;

export interface IFormatTempOptions {
  precision?: number;
  withDegree?: boolean;
  withUnit?: boolean;
  asDifference?: boolean;
}

export interface TemperatureValue {
  C: number;
  F: number;
}

export enum TemperatureUnit {
  Celsius = "C",
  Fahrenheit = "F"
}

export class Temperature {
  private rawValue: number;
  private unit: TemperatureUnit;

  public readonly value: TemperatureValue;

  constructor (rawValue: number, unit: TemperatureUnit) {
    this.rawValue = rawValue;
    this.unit = unit;
    this.value = this.getValue(rawValue, unit);
  }

  public format(options?: IFormatTempOptions): string {
    const o = options || {},
          delta = o.asDifference ? 0 : 32;

    const { rawValue, unit } = this;
    const {F, C} = this.getValue(rawValue, unit, delta);
    let f = F.toFixed(o.precision || 0);
    let c = C.toFixed(o.precision || 1);

    return `${this.formatUnitValue(f, TemperatureUnit.Fahrenheit, o)} / ${this.formatUnitValue(c, TemperatureUnit.Celsius, o)}`;
  }

  private formatUnitValue(s: string, unit: TemperatureUnit, o: IFormatTempOptions) {
    // eliminate "-0"
    if (s === "-0") { s = "0"; }
    // format positive differences with '+'
    if (o.asDifference && (s !== "0") && (s[0] !== '-')) {
      s = '+' + s;
    }
    return s
            + (o.withDegree ? "°" : "")
            + (o.withUnit ? `°${unit}` : "");
  }

  private getValue(rawValue: number, unit: TemperatureUnit, delta?: number) {
    return {
      F: unit === TemperatureUnit.Fahrenheit ? rawValue : cToF(rawValue, delta),
      C: unit === TemperatureUnit.Celsius ? rawValue : fToC(rawValue, delta)
    };
  }
}

