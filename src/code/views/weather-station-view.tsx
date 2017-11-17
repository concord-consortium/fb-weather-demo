import * as React from "react";
import { observer } from "mobx-react";
import { CardText } from "material-ui/Card";
import { ComponentStyleMap } from "../utilities/component-style-map";
import { simulationStore } from "../stores/simulation-store";
import { IWeatherStation } from "../models/weather-station";
import { weatherColor, precipDiv } from "./weather-styler";
export type StationTab = "configure" | "weather";

export interface WeatherStationProps {
  weatherStation: IWeatherStation | null;
}
export interface WeatherStationState {
}

@observer
export class WeatherStationView extends
  React.Component<WeatherStationProps,WeatherStationState> {
  constructor(props: WeatherStationProps, context: any) {
    super(props);
  }


  render() {
    let name = "";
    let callSign = "";
    const {weatherStation} = this.props;
    const time = simulationStore.timeString,
          simulationName = simulationStore.simulationName,
          temperature = weatherStation && weatherStation.temperature,
          unitTempStr = simulationStore.formatTemperature(temperature, { withUnit: true });
          // NP: Removed but saved in comments here for easy access.
          // Its likely we are going to put this back in at some point.
          // windSpeed = weatherStation && weatherStation.windSpeed,
          // isNonZeroSpeed = windSpeed && isFinite(windSpeed);
          // windSpeedStr = simulationStore.formatWindSpeed(windSpeed, { withUnit: true }),
          // windDirection = weatherStation && weatherStation.windDirection,
          // arrowRotation = (windDirection != null) && isFinite(windDirection)
          //                   ? windDirection + 90 : null,
          // arrowChar = isNonZeroSpeed && windDirection ? "\u279B" : "\xA0";
    if (weatherStation) {
      name = weatherStation.name;
      callSign = weatherStation.callSign;
    }
    const color = weatherColor(weatherStation);
    const styles: ComponentStyleMap = {
      info: {
        display: "grid",
        gridAutoColumns: "minmax(50px,200px)",
        gridGap: "10px",
        gridAutoRows: "minmax(50px, auto)",
      },
      name: {
        fontSize: "1pt"
      },
      simulationName: {
        gridRow: "1",
        gridColumn: "1",
        fontSize: "9pt",
        alignSelf: "flex-end"
      },
      graphic: {
        backgroundColor: color,
        gridRow: "2/5",
        gridColumn: "1",
        fontSize: "100px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      },
      callSign: {
        gridRow: "2",
        gridColumn: "2",
        fontSize: "24pt",
        fontWeight: "bold",
        alignSelf: "flex-start"
      },
      temp: {
        gridRow: "3",
        gridColumn: "2",
        fontSize: "24pt",
        fontWeight: "bold",
        alignSelf: "center"
      },
      precip: {
        gridRow: "4",
        gridColumn: "2",
        fontSize: "24pt",
        fontWeight: "bold",
        alignSelf: "flex-end"
      },
      time: {
        gridRow: "5",
        gridColumn: "1",
        fontSize: "12pt",
        color: "hsla(0, 0%, 10%, 0.9)"
      }
    };

    const settings = simulationStore.settings,
          showTemperature = settings && settings.showTempValues;

    function renderTemperature() {
      return showTemperature
              ? `Temp: ${unitTempStr || '29c'}`
              : null;
    }

    return (
      <div>
        <CardText>
          <div style={styles.info}>
            <div style={styles.simulationName}>
              Simulation: {simulationName}
            </div>
            <div style={styles.graphic}>
              <div>
                {precipDiv(weatherStation)}
              </div>
            </div>
            <div style={styles.callSign}>
              {callSign}
            </div>
            <div style={styles.name}>
              {name}
            </div>
            <div style={styles.time}>
              {time}
            </div>
            <div style={styles.temp}>
              {renderTemperature()}
            </div>
            <div style={styles.precip}>
              clear
            </div>
        </div>
        </CardText>
      </div>
    );
  }
}
