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
}

@observer
export class WeatherStationView extends React.Component<
  WeatherStationProps,
  WeatherStationState
> {
  pending: any;

  constructor(props: WeatherStationProps, context: any) {
    super(props);
    this.state = {
      tab: "configure"
    };
  }

  setConfig(data: IWeatherStation) {
    const presences = simulationStore.presences;
    if (presences) { presences.setStation(data); }
  }

  render() {
    let x = 0;
    let y = 0;
    let name = "";
    let callSign = "";
    let imgUrl = "img/farm.jpg";
    const time = simulationStore.timeString,
          weatherStation = simulationStore.presenceStation,
          tempStr = weatherStation && weatherStation.strTemperature(),
          unitTempStr = tempStr ? tempStr + "°" : tempStr,
          windSpeed = weatherStation && weatherStation.windSpeed,
          isNonZeroSpeed = windSpeed && isFinite(windSpeed),
          windSpeedStr = weatherStation && weatherStation.strWindSpeed(),
          windDirection = weatherStation && weatherStation.windDirection,
          arrowRotation = (windDirection != null) && isFinite(windDirection)
                            ? windDirection + 90 : null,
          arrowChar = isNonZeroSpeed && windDirection ? "\u279B" : "\xA0";

    if (weatherStation) {
      name = weatherStation.name;
      callSign = weatherStation.callSign;
      imgUrl = weatherStation.imageUrl;
    }

    const change = this.setConfig.bind(this);
    const styles: ComponentStyleMap = {
      info: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start"
      },
      callSign: {
        fontSize: "14pt",
        fontWeight: "bold"
      },
      name: {
        fontSize: "9pt",
        fontWeight: "bold"
      },
      stats: {
        display: "flex",
        fontSize: "3rem",
        color: "hsla(0, 0%, 100%, 0.9)"
      },
      temp: {
        minWidth: '5em'
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
                  <span>
                    {`Wind: ${windSpeedStr}\xA0`}
                  </span>,
                  <span style={{ transform: `rotate(${arrowRotation}deg`,
                                  display: 'inline-block'}}>
                    {arrowChar}
                  </span>
              ]
              : null;
    }

    return (
      <Card>
        <Tabs value={this.state.tab} onChange={handleChangeTab}>
          <Tab label="Configure" value="configure">
            <WeatherStationConfigView x={x} y={y} name={name} change={change} />
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
            <CardMedia
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
              }
            >
              <img src={imgUrl} />
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
