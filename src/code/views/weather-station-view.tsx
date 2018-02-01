import * as React from "react";
import RaisedButton from "material-ui/RaisedButton";
import { observer } from "mobx-react";
import { CardText } from "material-ui/Card";
import { ComponentStyleMap } from "../utilities/component-style-map";
import { simulationStore } from "../models/simulation";
import { IWeatherStation } from "../models/weather-station";
// import { weatherColor, precipDiv } from "./weather-styler";
import { gFirebase } from "../middleware/firebase-imp";

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

  handleExit = () => {
    gFirebase.signOut();
  }

  render() {
    let name = "";
    // let callSign = "";
    const {weatherStation} = this.props,
          simulation = simulationStore.selected,
          time = simulation && weatherStation && simulation.timeString,
          simulationName = simulation && simulation.name,
          temperature = weatherStation && weatherStation.temperature,
          unitTempStr = simulation && simulation.formatTemperature(temperature, { withUnit: true });
          // NP: Removed but saved in comments here for easy access.
          // Its likely we are going to put this back in at some point.
          // windSpeed = weatherStation && weatherStation.windSpeed,
          // isNonZeroSpeed = windSpeed && isFinite(windSpeed);
          // windSpeedStr = simulation.formatWindSpeed(windSpeed, { withUnit: true }),
          // windDirection = weatherStation && weatherStation.windDirection,
          // arrowRotation = (windDirection != null) && isFinite(windDirection)
          //                   ? windDirection + 90 : null,
          // arrowChar = isNonZeroSpeed && windDirection ? "\u279B" : "\xA0";
    if (weatherStation) {
      name = weatherStation.name;
      // callSign = weatherStation.callSign;
    }
    // const color = weatherColor(weatherStation);
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
        alignSelf: "flex-start"
      },
      // graphic: {
      //   backgroundColor: color,
      //   gridRow: "2/5",
      //   gridColumn: "1",
      //   fontSize: "100px",
      //   display: "flex",
      //   alignItems: "center",
      //   justifyContent: "center"
      // },
      time: {
        gridRow: "2",
        gridColumn: "2",
        fontSize: "36pt",
        fontWeight: "bold",
        color: "hsla(0, 0%, 10%, 0.9)"
      },
      callSign: {
        gridRow: "3",
        gridColumn: "2",
        fontSize: "36pt",
        fontWeight: "bold",
        alignSelf: "flex-start"
      },
      temp: {
        gridRow: "3",
        gridColumn: "2",
        fontSize: "36pt",
        fontWeight: "bold",
        alignSelf: "center"
      },
      precip: {
        gridRow: "4",
        gridColumn: "2",
        fontSize: "36pt",
        fontWeight: "bold",
        alignSelf: "flex-end"
      },
      button: {
        gridRow: "5",
        gridColumn: "1",
        boxShadow: "none",
        position: "relative",
        width: 160
      }
    };

    const settings = simulation && simulation.settings,
          showTemperature = settings && settings.showTempValues,
          hasPresence = !!(simulation && simulation.selectedPresence),
          temperatureStr = hasPresence
                            ? (showTemperature ? `${unitTempStr || ''}` : null)
                            : "Good \u00A0bye!",
          precip = weatherStation
                    ? (weatherStation.precipitation  ? "Rain" : "Clear")
                    : "",
          exitButton = hasPresence
                        ? <RaisedButton
                            className={"weather-station-exit-button"}
                            style={styles.button}
                            disabled={!hasPresence}
                            onClick={this.handleExit}
                            label="\u274C\u00A0\u00A0Sign Out"
                            primary={true}
                          />
                        : null;
    return (
      <div>
        <CardText>
          <div style={styles.info}>
            <div style={styles.simulationName}>
              {simulationName}
            </div>
            {/* <div style={styles.graphic}>
              <div>
                {precipDiv(weatherStation)}
              </div>
            </div> */}
            <div style={styles.time}>
              {time}
            </div>
            {/* <div style={styles.callSign}>
              {callSign}
            </div> */}
            <div style={styles.name}>
              {name}
            </div>
            <div style={styles.temp}>
              {temperatureStr}
            </div>
            <div style={styles.precip}>
              {precip}
            </div>
            {exitButton}
          </div>
        </CardText>
      </div>
    );
  }
}
