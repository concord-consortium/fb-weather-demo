import * as React from "react";
import { observer } from "mobx-react";
import { Card, CardMedia, CardActions, CardTitle } from "material-ui/Card";
import { Tab, Tabs } from "material-ui/Tabs";
import FloatingActionButton from "material-ui/FloatingActionButton";
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import { LeafletMapView } from "./leaflet-map-view";
import { TeacherOptionsView } from "./teacher-options-view";
import { ComponentStyleMap } from "../component-style-map";
import { PredictionType, IPrediction } from "../models/prediction";
import { simulationStore } from "../stores/simulation-store";
import { ISimulation } from "../models/simulation";

const _ = require("lodash");

export type TeacherViewTab = "control" | "configure";

export interface TeacherViewProps {}

export interface TeacherViewState {
  playing: boolean;
  frameRate: number;
  tab: TeacherViewTab;
}


const styles:ComponentStyleMap = {
  mapAndPrediction: {
    display: "flex",
    flexDirection: "row",
    overflow: "hidden",
    maxWidth: "90vw"
  },
  predictionContainer: {
    overflowY: "auto",
    height: "264px"
  },
  prediction: {
    display: "flex",
    flexDirection: "column",
    padding: "0em 2em",
    width: "20vw"
  },
  predictionItemEven: {
    backgroundColor: "hsl(0, 0%, 95%)",
    marginTop: "1em",
    padding: "0.25em"
  },
  predictionItemOdd: {
    backgroundColor: "hsl(0, 0%, 100%)",
    marginTop: "1em",
    padding: "0.25em"
  },
  callsign: {
    fontSize: "16pt",
    fontWeight: "bold"
  },
  stationName: {
    fontSize: "10pt"
  },
  values: {
    marginTop: "1em"
  },
  temp: {
    fontSize: "12pt",
    fontWeight: "bold"
  },
  label: {
    fontSize: "9pt",
    fontStyle: "italic",
    marginTop: "1em"
  },
  rationale: {
    fontSize: "13pt"
  },
  image: {
    height: "10vh"
  }
};

@observer
export class TeacherView extends React.Component<
  TeacherViewProps,
  TeacherViewState
> {
  interval: any;

  constructor(props: TeacherViewProps, ctxt: any) {
    super(props, ctxt);
    this.state = {
      playing: false,
      frameRate: 2000,
      tab: "control"
    };
  }

  handlePredictionTypeChange = (event: any, index: number, value: string) => {
    const simulation = simulationStore.selected;
    if(simulation) {
      console.log(`New prediction type: ${value}`);
      simulationStore.settings.setSetting('enabledPredictions', value);
    }
  }

  renderPredictions() {
    const weatherStation = simulationStore.stations.selected;
    if(weatherStation) {
      const predictions = simulationStore.predictions.teacherPredictions;

      const renderPrediction = (prediction:IPrediction, index:number) => {
        const style = index % 2 === 0 ? styles.predictionItemEven :  styles.predictionItemOdd;
        const result =(
          <div style={style} key={index}>
             {/* <span style={styles.temp}>{prediction.timeStamp}</span> */}
            <span style={styles.label}>Temp:</span>
            <span style={styles.temp}>{prediction.predictedValue}°</span>
            <div style={styles.label}>Reasoning:</div>
            <div style={styles.rationale}>{prediction.description}</div>
          </div>);
        // debugger;
        return result;
      };

      return (
        <div>
          <img style={styles.image} src={weatherStation.imageUrl}/>
          <div style={styles.callsign}>{weatherStation.callsign}</div>
          <div style={styles.stationName}>{weatherStation.name}</div>
          <div style={styles.predictionContainer}>
              {_.map(predictions,renderPrediction) }
          </div>
        </div>
      );
    }
    return null;
  }

  render() {
    const rewind = simulationStore.rewind;
    const play = simulationStore.play;
    const pause = simulationStore.stop;
    const time = simulationStore.timeString;
    const disablePlay = (simulationStore.selected && simulationStore.selected.isPlaying) ? true : false;
    const disablePause = !disablePlay;
    const handleChangeTab = (value: TeacherViewTab) => {
      this.setState({
        tab: value
      });
    };

    const simulationType = simulationStore.settings && simulationStore.settings.simulationType;
    const enabledPredictions = simulationStore.settings && simulationStore.settings.enabledPredictions;

    return (
      <Card>
        <Tabs value={this.state.tab} onChange={handleChangeTab}>
          <Tab label="Options" value="configure">
            <TeacherOptionsView />
          </Tab>
          <Tab label="Control" value="control">
            <CardTitle>
              Time: {time}
            </CardTitle>
            <CardMedia
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center"
              }}
            >
              {/* extra div eliminates material-ui warning:
                  "You cannot call prepareStyles() on the same style object more than once"
                  cf. https://github.com/callemall/material-ui/issues/4177 */}
              <div>
                <div style={styles.mapAndPrediction}>
                  <LeafletMapView
                    mapConfig={simulationStore.mapConfig}
                    interaction={false}
                    weatherStations={simulationStore.stations.stations}
                    width={600}
                    height={400}
                  />
                  <div style={styles.prediction}>
                    {this.renderPredictions()}
                  </div>
                </div>
                <CardActions>
                  <FloatingActionButton
                    iconClassName="icon-skip_previous"
                    onTouchTap={rewind}
                  />
                  <FloatingActionButton
                    iconClassName="icon-play_circle_filled"
                    disabled={disablePlay}
                    onTouchTap={play}
                  />
                  <FloatingActionButton
                    iconClassName="icon-pause_circle_filled"
                    disabled={disablePause}
                    onTouchTap={pause}
                  />
                  <DropDownMenu
                    style={styles.typeMenu}
                    value={enabledPredictions}
                    autoWidth={true}
                    onChange={this.handlePredictionTypeChange}>
                    <MenuItem value={null} primaryText="Disable Predictions" />
                    <MenuItem value={PredictionType.eDescription} primaryText="Enable Descriptive Predictions" />
                    <MenuItem value={PredictionType.eTemperature} primaryText="Enable Temperature Predictions" />
                  </DropDownMenu>
                </CardActions>
              </div>
            </CardMedia>
          </Tab>
        </Tabs>
      </Card>
    );
  }
}
