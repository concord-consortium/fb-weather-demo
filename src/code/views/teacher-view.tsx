import * as React from "react";
import { observer } from "mobx-react";
import { Card, CardMedia, CardActions, CardTitle } from "material-ui/Card";
import { Tab, Tabs } from "material-ui/Tabs";
import FloatingActionButton from "material-ui/FloatingActionButton";
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import { LeafletMapView } from "./leaflet-map-view";
import { TeacherOptionsView } from "./teacher-options-view";
import { ComponentStyleMap } from "../utilities/component-style-map";
import { PredictionType, IPrediction } from "../models/prediction";
import { simulationStore } from "../stores/simulation-store";

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
  callSign: {
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
    const settings = simulationStore.settings;
    if (settings) {
      console.log(`New prediction type: ${value}`);
      settings.setSetting('enabledPredictions', value);
    }
  }

  renderPredictions() {
    const weatherStation = simulationStore.selectedStation;
    if(weatherStation) {
      const predictions = simulationStore.predictions && simulationStore.predictions.teacherPredictions;

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
          <div style={styles.callSign}>{weatherStation.callSign}</div>
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
    const isPlaying = !!(simulationStore.selected && simulationStore.selected.isPlaying),
          playPauseIcon = isPlaying ? "icon-pause_circle_filled" : "icon-play_circle_filled",
          playPauseAction = isPlaying ? simulationStore.stop : simulationStore.play,
          time = simulationStore.timeString;

    const handleChangeTab = (value: TeacherViewTab) => {
      this.setState({
        tab: value
      });
    };

    const enabledPredictions = simulationStore.settings && simulationStore.settings.enabledPredictions,
          weatherStations = (simulationStore.stations && simulationStore.stations.stations) || [],
          menuOptions = [
            <MenuItem value={null} primaryText="Disable Predictions" />,
            <MenuItem value={PredictionType.eDescription} primaryText="Enable Descriptive Predictions" />,
            <MenuItem value={PredictionType.eTemperature} primaryText="Enable Temperature Predictions" />,
            <MenuItem value={PredictionType.eWindSpeed} primaryText="Enable Wind Speed Predictions" />,
            <MenuItem value={PredictionType.eWindDirection} primaryText="Enable Wind Direction Predictions" />
          ].filter((item) => {
            const settings = simulationStore.settings,
                  showTempValues = settings && settings.showTempValues,
                  showWindValues = settings && settings.showWindValues;
            if (!showTempValues && (item.props.value === PredictionType.eTemperature)) {
              return false;
            }
            if (!showWindValues && ((item.props.value === PredictionType.eWindSpeed) ||
                                    item.props.value === PredictionType.eWindDirection)) {
              return false;
            }
            return true;
          });

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
                    weatherStations={weatherStations}
                    width={600}
                    height={400}
                  />
                  <div style={styles.prediction}>
                    {this.renderPredictions()}
                  </div>
                </div>
                <CardActions>
                  <FloatingActionButton
                    iconClassName="icon-refresh"
                    disabled={isPlaying}
                    onTouchTap={simulationStore.rewind}
                  />
                  <FloatingActionButton
                    iconClassName="icon-skip_previous"
                    disabled={isPlaying}
                    onTouchTap={simulationStore.stepBack}
                  />
                  <FloatingActionButton
                    iconClassName={playPauseIcon}
                    onTouchTap={playPauseAction}
                  />
                  <FloatingActionButton
                    iconClassName="icon-skip_next"
                    disabled={isPlaying}
                    onTouchTap={simulationStore.stepForward}
                  />
                  <DropDownMenu
                    style={styles.typeMenu}
                    value={enabledPredictions}
                    autoWidth={true}
                    onChange={this.handlePredictionTypeChange}>
                    {menuOptions}
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
