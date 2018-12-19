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
import { gWeatherScenarioSpec } from "../models/weather-scenario-spec";
import { urlParams } from "../utilities/url-params";
import Popover from "material-ui-next/Popover";
import { TeacherCellPopover } from "./teacher-cell-popover";
import { TeacherOptionsButton } from "./teacher-options-button";
import { CopyStudentLinkButton } from "./copy-student-link-button";
import { gPortalUrlUtility, ActivityInfo } from "../utilities/portal-url-utility";
import { gFirebase } from "../middleware/firebase-imp";

export type TeacherViewTab = "control" | "configure";
export const MAP_TYPE_GRID = "MAP_TYPE_GRID";
export const MAP_TYPE_GEO  = "MAP_TYPE_GEO";

export interface TeacherViewProps {}

export interface TeacherViewState {
  tab: TeacherViewTab;
  popoverCell: string | null;
  popoverAnchorEl: HTMLElement | null;
  activityInfo: ActivityInfo | null;
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
  },
  geoMapWrapper: {
    position: "absolute",
    margin: "1em 0 0 1em",
    width: "500px",
    height: "500px",
    backgroundPosition: "62px 62px",
    backgroundSize: "432px 432px",
    backgroundRepeat: "no-repeat"
  },
  geoMapBackgroundAK: {
    backgroundImage: "url(./img/Alaska-EP-Base-Map-HC.png)",
  },
  geoMapBackgroundNE: {
    backgroundImage: "url(./img/EP-Base-Map-HC.png)",
  },
  mapViewWrapper: {
    zIndex: 1000
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
      popoverAnchorEl: null,
      activityInfo: null
    };
    this.closingCount = 0;
  }

  componentWillMount() {
    gPortalUrlUtility.getFirebaseSettings(gFirebase.portalAppName).then( ({activityInfo}) => {
      this.setState({activityInfo});
    });
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

    const showCities = simulation && simulation.settings.showCities &&
                       ! gWeatherScenarioSpec.mapConfig.geoMap;
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
        <div className="grid-cell-content">
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

    const styleForBackgroundGeoMap = () => {
      switch (gWeatherScenarioSpec.mapConfig.geoMap) {
        case "NomeAlaska": {
          return styles.geoMapBackgroundAK;
        }
        case "NewEngland": {
          return styles.geoMapBackgroundNE;
        }
        default: {
          return null;
        }
      }
    };

    const {activityInfo} = this.state;
    const tabLabel = activityInfo && (activityInfo.className || activityInfo.activityName || activityInfo.offeringId)
      ? `${activityInfo.className ? `${activityInfo.className}: ` : ""}${activityInfo.activityName} ${activityInfo.offeringId ? `#${activityInfo.offeringId}` : ""}`
      : "Control";

    return (
      <Card>
        <Tabs value={this.state.tab} onChange={handleChangeTab}>
          <Tab label={tabLabel} value="control">
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
                  <div style={styles.mapViewWrapper}>
                    { this.renderMapView() }
                  </div>
                  <div style={{...styles.geoMapWrapper, ...styleForBackgroundGeoMap()}} />
                </div>
                <div>
                  <SegmentedControlView />
                </div>
              </div>
            </CardMedia>
          </Tab>
        </Tabs>
      </Card>
    );
  }
}
