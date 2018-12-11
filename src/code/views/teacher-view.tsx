import * as React from "react";
import { observer } from "mobx-react";
import { Card, CardMedia, CardTitle } from "material-ui/Card";
import { Tab, Tabs } from "material-ui/Tabs";
import { cityAnnotation } from "../utilities/city-map";
import { GridView } from "./grid-view";
import { weatherColor, precipDiv } from "./weather-styler";
import { LeafletMapView } from "./leaflet-map-view";
import { SegmentedControlView } from "./segmented-control-view";
import { ComponentStyleMap } from "../utilities/component-style-map";

import { cellName, IGridCell } from "../models/grid-cell";
import { simulationStore } from "../models/simulation";
import { urlParams } from "../utilities/url-params";
import Popover from "material-ui-next/Popover";
import { TeacherCellPopover } from "./teacher-cell-popover";
import { TeacherOptionsButton } from "./teacher-options-button";
import { CopyStudentLinkButton } from "./copy-student-link-button";

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
export class TeacherView
  extends React.Component<TeacherViewProps, TeacherViewState> {

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

  handleCellClick = (cell:IGridCell, evt: React.MouseEvent<HTMLElement>) => {
    // Prevent reopening if we're in the process of closing.
    if (!this.closingCount) {
      const cellLabel = cellName(cell.row, cell.column);
      this.setState({ popoverCell: cellLabel, popoverAnchorEl: evt.currentTarget });
    }
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
          userCount = simulation && simulation.presences.size,
          usersString = `${userCount} ${userCount === 1 ? 'user' : 'users'}`,
          copyStudentUrlButton = urlParams.isTesting
                                  ? <CopyStudentLinkButton />
                                  : null;

    const handleChangeTab = (value: TeacherViewTab) => {
      this.setState({
        tab: value
      });
    };

    return (
      <Card>
        <Tabs value={this.state.tab} onChange={handleChangeTab}>
          <Tab label="Control" value="control">
            <CardTitle>
              <div className="teacher-title-card-contents"
                    style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ fontWeight: 'bold', fontSize: "14pt"}}>{time}</div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <div>{simulation && simulation.displayName || ""}</div>
                  <div className="teacher-status-options">
                    <div>{usersString}</div>
                    <div className="teacher-option-buttons">
                      {copyStudentUrlButton}
                      <TeacherOptionsButton />
                    </div>
                  </div>
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
              <div className="teacher-card-media-wrapper" style={styles.wrapper}>
                <div className="teacher-card-media-map" style={styles.mapAndPrediction}>
                    { this.renderMapView() }
                </div>
                  <SegmentedControlView />
              </div>
            </CardMedia>
          </Tab>
        </Tabs>
      </Card>
    );
  }
}
