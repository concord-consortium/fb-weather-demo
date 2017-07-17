import * as React from "react";
import { observer } from "mobx-react";
import { Card, CardText, CardMedia, CardTitle } from "material-ui/Card";
import { Tab, Tabs } from "material-ui/Tabs";
import { WeatherStationConfigView } from "./weather-station-config-view";
import { GridView } from "./grid-view";
import { PredictionView } from "./prediction-view";
import { SimPrefs } from "../sim-prefs";
import { ComponentStyleMap } from "../component-style-map";
import { dataStore } from "../data-store";
import { Basestation } from "../basestation";

const dateFormat = require("dateformat");
const div = React.DOM.div;

export type StationTab = "configure" | "weather";

export interface WeatherStationProps {
  prefs: SimPrefs;
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

  setConfig(data: Basestation) {
    dataStore.updateBasestation(data);
  }

  render() {
    let x = 0;
    let y = 0;
    let name = "";
    let imgUrl = "img/farm.jpg";
    let time = dataStore.timeString;

    if (dataStore.basestation) {
      name = dataStore.basestation.name;
      imgUrl = dataStore.basestation.imageUrl;
    }

    const change = this.setConfig.bind(this);
    const styles: ComponentStyleMap = {
      info: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start"
      },
      temp: {
        fontSize: "4rem",
        color: "hsla(0, 0%, 100%, 0.9)"
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

    return (
      <Card>
        <Tabs value={this.state.tab} onChange={handleChangeTab}>
          <Tab label="Configure" value="configure">
            <WeatherStationConfigView x={x} y={y} name={name} change={change} />
          </Tab>
          <Tab label="Weather" value="weather">
            <CardText>
              <div style={styles.info}>
                <div>
                  <div className="name">
                    {name || "(no name provided)"}
                  </div>
                </div>
              </div>
            </CardText>
            <CardMedia
              overlay={
                <div>
                  <CardTitle
                    titleStyle={styles.temp}
                    title={`Temp: ${dataStore.temp}°`}
                  />
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
              <PredictionView enabled={dataStore.prefs.enablePrediction} />
            </CardText>
          </Tab>
        </Tabs>
      </Card>
    );
  }
}
