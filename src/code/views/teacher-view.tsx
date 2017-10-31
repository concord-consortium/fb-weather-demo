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
const TreeView = require("react-treeview");
require("!style-loader!css-loader!react-treeview/react-treeview.css");
require("!style-loader!css-loader!../../html/treeview.css");
import * as _ from "lodash";

export type TeacherViewTab = "control" | "configure";

export interface TeacherViewProps {}

export interface TeacherViewState {
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
  predictionsTitle: {
    marginTop: 16,
    marginLeft: 20,
    fontWeight: 'bold'
  },
  prediction: {
    display: "flex",
    flexDirection: "column",
    paddingLeft: "2em",
    width: "20em"
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
                                  TeacherViewState> {

  constructor(props: TeacherViewProps, ctxt: any) {
    super(props, ctxt);
    this.state = {
      tab: "control"
    };
  }

  handlePredictionTypeChange = (event: any, index: number, value: string) => {
    const settings = simulationStore.settings;
    if (settings) {
      settings.setSetting('enabledPredictions', value);
    }
  }

  renderPredictions() {
    const weatherStation = simulationStore.selectedStation;
    if (!weatherStation) { return null; }

    const predictions = (simulationStore.predictions && simulationStore.predictions.teacherPredictions) || [],
          predictedTimes = {} as { [key: string] : { [key: string] : IPrediction[] } };

    predictions.forEach((p) => {
      const pdt = String(p.predictedTime.getTime()),
            pnt = String(p.predictionTime.getTime());
      if (predictedTimes[pdt] == null) {
        predictedTimes[pdt] = {};
      }
      const pdtSet = predictedTimes[pdt];
      if (pdtSet[pnt] == null) {
        pdtSet[pnt] = [];
      }
      pdtSet[pnt].push(p);
    });

    function formatPredictedValueLabel(prediction: IPrediction) {
      return (prediction.type === PredictionType.eDescription)
                ? "Descriptive"
                : prediction.predictedValueLabel;
    }

    function formatPredictedValue(prediction: IPrediction) {
      const d = prediction.description,
            kLimit = 17;
      return (prediction.type === PredictionType.eDescription)
                ? (d.length > kLimit
                    ? `"${prediction.description.substr(0, kLimit)}..."`
                    : d)
                : prediction.formatPredictedValue({ withUnit: true });
    }

    function renderPredictionTree(predictions: IPrediction[]) {
      return _.sortBy(predictions, 'timeStamp').reverse().map((p) => {
                const timeStamp = simulationStore.formatLocalTime(p.timeStamp, 'l LT'),
                      key = p.timeStamp.getTime(),
                      sLabel = formatPredictedValueLabel(p),
                      sValue = formatPredictedValue(p),
                      dLabel = p.descriptionLabel,
                      pLabel = <span className="node gray-bg">{sLabel}: {sValue}</span>;
                return (
                  <TreeView key={key} nodeLabel={pLabel} defaultCollapsed={true}>
                    <div key="description" className="info">{dLabel}: {p.description}</div>
                    <div key="time" className="info">Submitted: {timeStamp}</div>
                  </TreeView>
                );
            });
    }

    function renderPredictionTreeView() {
      return _.keys(predictedTimes).sort().reverse().map((pdt: string) => {
        const spdt = simulationStore.formatTime(new Date(Number(pdt)), 'l LT'),
              pdtLabel = <span className="node gray-bg">Predictions for: {spdt}</span>,
              pdtSet = predictedTimes[pdt],
              pntLabels = _.keys(pdtSet).map((pnt: string) => {
                const spnt = simulationStore.formatTime(new Date(Number(pnt)), 'l LT'),
                      pntLabel = <span className="node">Predicted at: {spnt}</span>,
                      predictions = pdtSet[pnt],
                      predictionTrees = renderPredictionTree(predictions);
                return (
                  <TreeView key={pnt} nodeLabel={pntLabel} defaultCollapsed={true}>
                    {predictionTrees}
                  </TreeView>
                );
              });
        return (
          <TreeView key={pdt} nodeLabel={pdtLabel} defaultCollapsed={true}>
            {pntLabels}
          </TreeView>
        );
      });
    }

    return (
      <div>
        <img style={styles.image} src={weatherStation.imageUrl}/>
        <div style={styles.callSign}>{weatherStation.callSign}</div>
        <div style={styles.stationName}>{weatherStation.name}</div>
        <div style={styles.predictionContainer}>
            <div style={styles.predictionsTitle}>Predictions</div>
            {renderPredictionTreeView()}
        </div>
      </div>
    );
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
            <MenuItem key={0} value={null} primaryText="Disable Predictions" />,
            <MenuItem key={1} value={PredictionType.eDescription} primaryText="Enable Descriptive Predictions" />,
            <MenuItem key={2} value={PredictionType.eTemperature} primaryText="Enable Temperature Predictions" />,
            <MenuItem key={3} value={PredictionType.eWindSpeed} primaryText="Enable Wind Speed Predictions" />,
            <MenuItem key={4} value={PredictionType.eWindDirection} primaryText="Enable Wind Direction Predictions" />
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
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>Time: {time}</div>
                <div style={{ fontWeight: 'bold' }}>{simulationStore.simulationName}</div>
              </div>
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