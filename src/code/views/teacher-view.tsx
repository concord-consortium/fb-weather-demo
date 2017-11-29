import * as React from "react";
import { observer } from "mobx-react";
import { Card, CardMedia, CardTitle } from "material-ui/Card";
import { Tab, Tabs } from "material-ui/Tabs";

import { GridView } from "./grid-view";
import { weatherColor, precipDiv } from "./weather-styler";
import { LeafletMapView } from "./leaflet-map-view";
import { PlaybackOptionsView } from "./playback-options-view";
import { PlaybackControlView } from "./playback-control-view";
import { SegmentedControlView } from "./segmented-control-view";
import { ComponentStyleMap } from "../utilities/component-style-map";

import { IGridCell } from "../models/grid-cell";
import { simulationStore } from "../models/simulation";


require("!style-loader!css-loader!react-treeview/react-treeview.css");
require("!style-loader!css-loader!../../html/treeview.css");

export type TeacherViewTab = "control" | "configure";
export const MAP_TYPE_GRID = "MAP_TYPE_GRID";
export const MAP_TYPE_GEO  = "MAP_TYPE_GEO";

export interface TeacherViewProps {}

export interface TeacherViewState {
  tab: TeacherViewTab;
}


const styles:ComponentStyleMap = {
  wrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
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
    const simulation = simulationStore.selected;
    const settings = simulation.settings;
    if (settings) {
      settings.setSetting('enabledPredictions', value);
    }
  }

  renderLeafletMap() {
    const simulation = simulationStore.selected;
    const weatherStations = (simulation.stations && simulation.stations.stations) || [];
    return (
      <LeafletMapView
        mapConfig={simulation.mapConfig}
        interaction={false}
        weatherStations={weatherStations}
        width={600}
        height={400}
      />
    );
  }

  renderGridMap() {
    const simulation = simulationStore.selected;
    const grid = simulation.grid;

    const colorFunc = (cell:IGridCell) => {
      const station = simulation.stations && simulation.stations.getStation(cell.weatherStationId);
      return weatherColor(station);
    };

    const titleFunc = (cell:IGridCell) => {
      const station = simulation.stations && simulation.stations.getStation(cell.weatherStationId);
      return precipDiv(station);
    };

    return (
      <GridView grid={grid} colorFunc={colorFunc} titleFunc={titleFunc} />
    );
  }

  renderMapView() {
    let mapKind = MAP_TYPE_GRID;
    if(mapKind === MAP_TYPE_GRID) { return this.renderGridMap(); }
    if(mapKind === MAP_TYPE_GEO)  { return this.renderLeafletMap(); }
  }

  render() {
    const simulation = simulationStore.selected;
    const time = simulation.timeString;

    const handleChangeTab = (value: TeacherViewTab) => {
      this.setState({
        tab: value
      });
    };

    return (
      <Card>
        <Tabs value={this.state.tab} onChange={handleChangeTab}>
          <Tab label="Options" value="configure">
            <PlaybackOptionsView />
          </Tab>
          <Tab label="Control" value="control">
            <CardTitle>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ fontWeight: 'bold', fontSize: "14pt"}}> {time}</div>
                <div>{simulation.name}</div>
              </div>
            </CardTitle>
            <CardMedia
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center"
              }}
            >
              <div style={styles.wrapper}>
                <div style={styles.mapAndPrediction}>
                    { this.renderMapView() }
                  {/*
                    import { PredictionDisplayView } from "../prediction-display-view"
                    <PredictionDisplayView />
                  */}
                </div>
                  <SegmentedControlView />
                  <PlaybackControlView />
                {/*
                  import { PredictionSelectorView } from "../prediction-selection-view"
                  <PredictionSelectorView />
                */}

              </div>
            </CardMedia>
          </Tab>
        </Tabs>
      </Card>
    );
  }
}
