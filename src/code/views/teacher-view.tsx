import * as React from "react";
import * as Clipboard from "clipboard";
import { observer } from "mobx-react";
import { Card, CardMedia, CardTitle } from "material-ui/Card";
import { Tab, Tabs } from "material-ui/Tabs";
import { cityAnnotation } from "../utilities/city-map";
import { GridView } from "./grid-view";
import { weatherColor, precipDiv } from "./weather-styler";
import { LeafletMapView } from "./leaflet-map-view";
// import { PlaybackOptionsView } from "./playback-options-view";
// import { PlaybackControlView } from "./playback-control-view";
import { SegmentedControlView } from "./segmented-control-view";
import { ComponentStyleMap } from "../utilities/component-style-map";
//import { TeacherOptionsView } from "./teacher-options-view";

import { cellName, IGridCell } from "../models/grid-cell";
import { simulationStore } from "../models/simulation";
import { urlParams } from "../utilities/url-params";
import Popover from "material-ui-next/Popover";
import { TeacherCellPopover } from "./teacher-cell-popover";


// require("!style-loader!css-loader!react-treeview/react-treeview.css");
// require("!style-loader!css-loader!../../html/treeview.css");

export type TeacherViewTab = "control" | "configure";
export const MAP_TYPE_GRID = "MAP_TYPE_GRID";
export const MAP_TYPE_GEO  = "MAP_TYPE_GEO";

export interface TeacherViewProps {}

export interface TeacherViewState {
  tab: TeacherViewTab;
  popoverCell: string | null;
  popoverAnchorEl: HTMLElement | null;
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
  groupLabel: {
    fontSize: "12px",
    position: "absolute",
    left: 6,
    bottom: 2
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

  clipboard: Clipboard;
  closingCount: number;

  constructor(props: TeacherViewProps, ctxt: any) {
    super(props, ctxt);
    this.state = {
      tab: "control",
      popoverCell: null,
      popoverAnchorEl: null
    };
    this.closingCount = 0;
  }

  handlePredictionTypeChange = (event: any, index: number, value: string) => {
    const simulation = simulationStore.selected,
          settings = simulation && simulation.settings;
    if (settings) {
      settings.setSetting('enabledPredictions', value);
    }
  }

  componentDidMount() {
    if (urlParams.isTesting && Clipboard.isSupported()) {
      this.clipboard = new Clipboard('.clipboard-button');
    }
  }

  componentWillUnmount() {
    if (this.clipboard) {
      this.clipboard.destroy();
    }
  }

  handleCellClick = (cell:IGridCell, evt: React.MouseEvent<HTMLElement>) => {
    // Prevent reopening if we're in the process of closing.
    if (this.closingCount) { return; }
    const classes = evt.currentTarget.className;
    const match = /grid-cell-label-([A-Z]-[0-9]*)/.exec(classes);
    const cellName = match && match[1] || null;
    this.setState({ popoverCell: cellName, popoverAnchorEl: evt.currentTarget });
  }

  handleRequestClose = () => {
    // Track whether we're in the process of closing to prevent reopening.
    ++ this.closingCount;
    this.setState({ popoverCell: null, popoverAnchorEl: null }, () => --this.closingCount);
  }

  renderLeafletMap() {
    const simulation = simulationStore.selected,
          weatherStations = simulation && simulation.stations &&
                              simulation.stations.stations || [];
    return (
      <LeafletMapView
        mapConfig={simulation && simulation.mapConfig}
        interaction={false}
        weatherStations={weatherStations}
        width={600}
        height={400}
      />
    );
  }

  renderGridMap() {
    const simulation = simulationStore.selected,
          grid = simulation && simulation.grid,
          groupMap: { [index:string]: string } = {};

    if (simulation) {
      simulation.presences.presenceList.forEach((presence) => {
        if (presence.groupName && presence.weatherStationID) {
          groupMap[presence.weatherStationID] = presence.groupName;
        }
      });
    }
    const colorFunc = (cell:IGridCell) => {
      const station = simulation && simulation.stations &&
                      simulation.stations.getStation(cell.weatherStationId);
      return weatherColor(station);
    };

    const showCities = simulation && simulation.settings.showCities;
    const titleFunc = (cell:IGridCell) => {
      const station = simulation && simulation.stations &&
                      simulation.stations.getStation(cell.weatherStationId);
      const precip = precipDiv(station);
      const city = showCities ? cityAnnotation(cell.weatherStationId) : null;
      const cellLabel = cellName(cell.row, cell.column);
      const isOpenPopoverCell = this.state.popoverCell === cellLabel;
      const group = groupMap[cellLabel];
      const groupLabel = group
                          ? <div className="grid-cell-group-label" style={styles.groupLabel}>
                              {group}
                            </div>
                          : null;
      const popover = <Popover
                        className='teacher-cell-popover-trigger'
                        open={isOpenPopoverCell}
                        anchorEl={(isOpenPopoverCell && this.state.popoverAnchorEl) || undefined}
                        anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                        transformOrigin={{horizontal: 'left', vertical: 'top'}}
                        onBackdropClick={this.handleRequestClose}
                        onClose={this.handleRequestClose}
                      >
                        <TeacherCellPopover
                          simulation={simulation}
                          cell={cell}
                          group={group}
                          station={station}
                        />
                      </Popover>;
      return (
        <div className="grid-cell-content" style={{}}>
          {city}
          {precip}
          {groupLabel}
          {popover}
        </div>
      );
    };

    return (
      <GridView grid={grid} colorFunc={colorFunc} titleFunc={titleFunc}
                onCellClick={this.handleCellClick}
      />
    );
  }

  renderMapView() {
    let mapKind = MAP_TYPE_GRID;
    if(mapKind === MAP_TYPE_GRID) { return this.renderGridMap(); }
    if(mapKind === MAP_TYPE_GEO)  { return this.renderLeafletMap(); }
  }

  render() {
    const simulation = simulationStore.selected,
          time = simulation && simulation.timeString,
          teacherUrl = window.location.href,
          studentUrl = urlParams.isTesting
                        ? teacherUrl.replace('show/teacher', 'show/student')
                        : '',
          studentUrlBtn = studentUrl
                            ? <button className="clipboard-button" data-clipboard-text={studentUrl}>
                                Copy student URL to clipboard
                              </button>
                            : null,
          userCount = simulation && simulation.presences.size,
          usersString = `${userCount} ${userCount === 1 ? 'user' : 'users'}`;

    const handleChangeTab = (value: TeacherViewTab) => {
      this.setState({
        tab: value
      });
    };

    return (
      <Card>
        <Tabs value={this.state.tab} onChange={handleChangeTab}>
          {/* <Tab label="Options" value="configure">
            <PlaybackOptionsView />
            <TeacherOptionsView />
          </Tab> */}
          <Tab label="Control" value="control">
            <CardTitle>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ fontWeight: 'bold', fontSize: "14pt"}}> {time}</div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <div>{simulation && simulation.name || ""}</div>
                  <div>{usersString}</div>
                  {studentUrlBtn}
                </div>
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
                  {/* <PlaybackControlView /> */}
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
