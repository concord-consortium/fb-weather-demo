import * as React from "react";
import { observer } from "mobx-react";
import { Card, CardText, CardMedia, CardTitle } from "material-ui/Card";
import { Tab, Tabs } from "material-ui/Tabs";
import { WeatherStationConfigView } from "./weather-station-config-view";
import { PredictionView } from "./prediction-view";
import { ComponentStyleMap } from "../utilities/component-style-map";
import { IWeatherStation } from "../models/weather-station";
import { simulationStore } from "../stores/simulation-store";

export type StationTab = "configure" | "weather";

export interface WeatherStationProps {
}
export interface WeatherStationState {
  tab: StationTab;
  station?: IWeatherStation | null;
}

@observer
export class WeatherStationView extends React.Component<
                                          WeatherStationProps,
                                          WeatherStationState> {
  constructor(props: WeatherStationProps, context: any) {
    super(props);

    const station = simulationStore.presenceStation;
    this.state = {
      tab: station ? "weather" : "configure",
      station
    };
  }

  handleChangeStation = (station: IWeatherStation | null) => {
    const presences = simulationStore.presences;
    if (presences) {
      presences.setStation(station);
      if (station) {
        this.setState({ tab: "weather", station });
      }
    }
  }

  render() {
    let name = "";
    let callSign = "";
    let imgUrl = "img/farm.jpg";
    const time = simulationStore.timeString,
          weatherStation = this.state.station || simulationStore.presenceStation,
          temperature = weatherStation && weatherStation.temperature,
          unitTempStr = simulationStore.formatTemperature(temperature, { withDegreeUnit: true }),
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
      imgUrl = weatherStation.imageUrl;
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
        fontSize: "16pt",
        fontWeight: "bold"
      },
      name: {
        fontSize: "16pt",
        fontWeight: "bold"
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
    const handleChangeTab = (newTab: StationTab) => {
      this.setState({
        tab: newTab
      });
    };

    const settings = simulationStore.settings,
          showTemperature = settings && settings.showTempValues,
          showWindValues = settings && settings.showWindValues;

    function renderTemperature() {
      return showTemperature
              ? `Temp: ${unitTempStr}`
              : null;
    }

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
      <Card style={styles.card}>
        <Tabs value={this.state.tab} onChange={handleChangeTab}>
          <Tab label="Configure" value="configure">
            <WeatherStationConfigView station={weatherStation} onChangeStation={this.handleChangeStation} />
          </Tab>
          <Tab label="Weather" value="weather">
            <CardText>
              <div style={styles.info}>
                <div style={styles.callSign}>
                  {callSign}
                </div>
                <div style={styles.name}>
                  {name}
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
              <img style={styles.image} src={imgUrl} />
            </CardMedia>
          </Tab>
          <Tab label="Predict" value="predict">
            <CardText>
              <PredictionView />
            </CardText>
          </Tab>
        </Tabs>
      </Card>
    );
  }
}
