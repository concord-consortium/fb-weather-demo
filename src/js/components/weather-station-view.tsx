import * as React from "react";
import {observer} from 'mobx-react';
import { Card, CardText, CardMedia, CardTitle } from "material-ui/Card";
import { Tab, Tabs } from "material-ui/Tabs";
import { WeatherStationConfigView }  from "./weather-station-config-view";
import { GridView } from "./grid-view";
import { PredictionView } from "./prediction-view";
import { SimPrefs } from "../sim-prefs";
import { Frame } from "../frame"
import { ComponentStyleMap } from "../component-style-map";
import { dataStore, Basestation } from "../data-store";

const dateFormat = require("dateformat");
const div = React.DOM.div;

export type StationTab = "configure" | "weather";

export interface WeatherStationProps {
  prefs: SimPrefs
}

export interface WeatherStationState {
  tab: StationTab
}

@observer
export class WeatherStationView extends React.Component<WeatherStationProps, WeatherStationState> {
  pending: any

  constructor(props:WeatherStationProps, context:any){
    super(props);
    this.state = {
      tab: "weather"
    };
  }

  setConfig(data:Basestation) {
    dataStore.basestation = data;
  }

  render() {
    const frameNumber = dataStore.frame;
    const frames = dataStore.frames;
    if (!dataStore.basestation) { return null; }

    const x = dataStore.basestation.gridX;
    const y = dataStore.basestation.gridY;
    const name =  dataStore.basestation.name;
    let mapData;
    let time = frameNumber;
    if (frames && frames.length > 0 && frames[frameNumber]) {
      const frame = frames[frameNumber];
      const grids = frame.grids;
      time =  frame.time ? dateFormat(new Date(frame.time)) : time;
      if (grids) {
        const classGrid = grids.classGrid;
        mapData = classGrid;
      }
    }
    mapData = mapData || [ [0,0,0], [0,0,0], [0,0,0] ];

    const tempData = mapData[y][x];
    const change = this.setConfig.bind(this);
    const styles:ComponentStyleMap = {
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
    const handleChangeTab = (newTab:StationTab) => {
      this.setState({
        tab: newTab,
      });
    };

    return (
      <Card>
        <Tabs value={this.state.tab} onChange={handleChangeTab}>
          <Tab label="Configure" value="configure">
            <WeatherStationConfigView x={x} y={y} name={name} frames={frames} change={change} />
          </Tab>
          <Tab label="Weather" value="weather">
            <CardText>
              <div style={styles.info}>
                <div>
                  <div className="name">{name || "(no name provided)"}</div>
                </div>
                <GridView x={x} y={y} rows={3} cols={3} />
              </div>
            </CardText>
            <CardMedia
              overlay={
                <div>
                  <CardTitle titleStyle={styles.temp} title={`Temp: ${tempData.toFixed(1)}°`} />
                  <CardText style={styles.time} >
                    {`${time} | frame(${frameNumber})`}
                  </CardText>
                </div>
              }>
              <img src="img/farm.jpg"/>
            </CardMedia>
          </Tab>
          <Tab label="Predict" value="predict">
            <CardText>
              <PredictionView enabled={this.props.prefs.enablePrediction} />
            </CardText>
          </Tab>
        </Tabs>
      </Card>
    );
  }
}