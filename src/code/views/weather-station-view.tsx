import * as React from "react";
import { observer } from "mobx-react";
import { CardText, CardMedia, CardTitle } from "material-ui/Card";
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
          unitTempStr = simulationStore.formatTemperature(temperature, { withUnit: true }),
          windSpeed = weatherStation && weatherStation.windSpeed,
          isNonZeroSpeed = windSpeed && isFinite(windSpeed),
          windSpeedStr = simulationStore.formatWindSpeed(windSpeed, { withUnit: true }),
          windDirection = weatherStation && weatherStation.windDirection,
          arrowRotation = (windDirection != null) && isFinite(windDirection)
                            ? windDirection + 90 : null,
          arrowChar = isNonZeroSpeed && windDirection ? "\u279B" : "\xA0";

    if (weatherStation) {
      name = weatherStation.name;
      callSign = weatherStation.callSign;
      imageUrl = weatherStation.imageUrl;
    }

    const styles: ComponentStyleMap = {
      card: {
      },
      info: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start"
      },
      callSign: {
        fontSize: "24pt",
        fontWeight: "bold"
      },
      name: {
        fontSize: "1pt"
      },
      simulationName: {
        fontSize: "9pt"
      },
      media: {
      },
      image: {
        height: 600,
        maxHeight: 600,
        objectFit: 'contain'
      },
      stats: {
        display: "flex",
        fontSize: "3rem",
        color: "hsla(0, 0%, 100%, 0.9)"
      },
      temp: {
        minWidth: '6em'
      },
      time: {
        color: "hsla(0, 0%, 80%, 0.9)"
      }
    };

    const settings = simulationStore.settings,
          showTemperature = settings && settings.showTempValues,
          showWindValues = settings && settings.showWindValues;

    function renderTemperature() {
      return showTemperature
              ? `Temp: ${unitTempStr}`
              : null;
    }

    const image = (imageUrl && (imageUrl.length > 1))
      ? <img style={styles.image} src={imageUrl} />
      : <div style={styles.image} />;

    function renderWindValues() {
      return showWindValues
              ? [
                  <span key='speed'>
                    {`Wind: ${windSpeedStr}\xA0`}
                  </span>,
                  <span key='direction'
                        style={{ transform: `rotate(${arrowRotation}deg`, display: 'inline-block'}}>
                    {arrowChar}
                  </span>
              ]
              : null;
    }

    return (
      <div>
        <CardText>
          <div style={styles.info}>
            <div style={styles.callSign}>
              {callSign}
            </div>
            <div style={styles.name}>
            {name}
          </div>
          <div style={styles.simulationName}>
            {simulationName}
          </div>
        </div>
        </CardText>
        <CardMedia style={styles.media}
          overlay={
            <div>
              <CardTitle>
                <div style={styles.stats}>
                  <div style={styles.temp}>
                    {renderTemperature()}
                  </div>
                  <div style={styles.wind}>
                    {renderWindValues()}
                  </div>
                </div>
              </CardTitle>
              <CardText style={styles.time}>
                {time}
              </CardText>
            </div>
          } >
          { image }
        </CardMedia>
      </div>
    );
  }
}
