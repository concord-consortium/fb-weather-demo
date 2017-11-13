import * as React from "react";
import { observer } from "mobx-react";
import { CardText } from "material-ui/Card";
import { ComponentStyleMap } from "../utilities/component-style-map";
import { simulationStore } from "../stores/simulation-store";
import { IWeatherStation } from "../models/weather-station";

export type StationTab = "configure" | "weather";

export interface WeatherStationProps {
  weatherStation: IWeatherStation | null;
}
export interface WeatherStationState {
}

@observer
export class WeatherStationView extends React.Component<
                                          WeatherStationProps,
                                          WeatherStationState> {
  constructor(props: WeatherStationProps, context: any) {
    super(props);
  }


  render() {
    let name = "";
    let callSign = "";
    let imageUrl = "";
    const {weatherStation} = this.props;
    const time = simulationStore.timeString,
          simulationName = simulationStore.simulationName,
          temperature = weatherStation && weatherStation.temperature,
          unitTempStr = simulationStore.formatTemperature(temperature, { withUnit: true });
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
      imageUrl = weatherStation.imageUrl;
    }

    const styles: ComponentStyleMap = {
      card: {
      },
      info: {
      },
      callSign: {
        fontSize: "24pt",
        fontWeight: "bold"
      },
      name: {
        fontSize: "1pt"
      },
      simulationName: {
        fontSize: "9pt",
        color: "hsla(0, 0%, 80%, 0.9)"
      },
      datum: {
        marginTop: '1em',
        marginBottom: '1em'
      },
      time: {
        color: "hsla(0, 0%, 80%, 0.9)"
      }
    };

    const settings = simulationStore.settings,
          showTemperature = settings && settings.showTempValues;

    function renderTemperature() {
      return showTemperature
              ? `Temp: ${unitTempStr || '29c'}`
              : null;
    }

    // function renderWindValues() {
    //   return showWindValues
    //           ? [
    //               <span key='speed'>
    //                 {`Wind: ${windSpeedStr}\xA0`}
    //               </span>,
    //               <span key='direction'
    //                     style={{ transform: `rotate(${arrowRotation}deg`, display: 'inline-block'}}>
    //                 {arrowChar}
    //               </span>
    //           ]
    //           : null;
    // }

    return (
      <div>
        <CardText>
          <div style={styles.info}>
            <div style={styles.simulationName}>
              Simulation Name: {simulationName}
            </div>
            <div style={styles.callSign}>
              Cell: {callSign}
            </div>
            <div style={styles.name}>
              {name}
            </div>
            <div style={styles.time}>
              Time: {time}
            </div>
            <div style={styles.datum}>
              {renderTemperature()}
            </div>
            <div style={styles.datum}>
              Precipitation: clear
            </div>
        </div>
        </CardText>
      </div>
    );
  }
}
