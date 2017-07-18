import * as React from "react";
import { observer } from "mobx-react";
import { Card, CardMedia, CardActions, CardTitle } from "material-ui/Card";
import { Tab, Tabs } from "material-ui/Tabs";
import FloatingActionButton from "material-ui/FloatingActionButton";
import { LeafletMapView } from "./leaflet-map-view";
import { TeacherOptionsView } from "./teacher-options-view";
import { ComponentStyleMap } from "../component-style-map";
import { dataStore } from "../data-store";

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
  prediction: {
    display: "flex",
    flexDirection: "column",
    padding: "0em 2em",
    width: "20vw"
  },
  callsign: {
    fontSize: "16pt",
    fontWeight: "bold"
  },
  stationName: {
    fontSize: "10pt"
  },
  temp: {
    fontSize: "12pt",
    fontWeight: "bold"
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

  play() {
    if (this.interval) {
      clearInterval(this.interval);
    }
    this.interval = setInterval(() => dataStore.nextFrame(), 1000);
    this.setState({ playing: true });
  }

  pause() {
    clearInterval(this.interval);
    this.interval = null;
    this.setState({ playing: false });
  }

  rewind() {
    dataStore.setFrame(0);
  }

  renderPrediction() {
    if(dataStore.basestation) {
      return(
        <div>
          <img style={styles.image} src={dataStore.basestation.imageUrl}/>
          <div style={styles.callsign}>{dataStore.basestation.callsign}</div>
          <div style={styles.stationName}>{dataStore.basestation.name}</div>
          <div style={styles.temp}>{dataStore.prediction.temp}</div>
          <div style={styles.rationale}>{dataStore.prediction.rationale}</div>
        </div>
      );
    }
    return null;
  }

  render() {
    const rewind = this.rewind.bind(this);
    const play = this.play.bind(this);
    const pause = this.pause.bind(this);
    const time = dataStore.timeString;
    const disablePlay = !!this.interval;
    const disablePause = !disablePlay;
    const handleChangeTab = (value: TeacherViewTab) => {
      this.setState({
        tab: value
      });
    };

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
              <div style={styles.mapAndPrediction}>
                <LeafletMapView
                  mapConfig={dataStore.mapConfig}
                  interaction={false}
                  baseStations={dataStore.basestations}
                  width={600}
                  height={400}
                />
                <div style={styles.prediction}>
                  {this.renderPrediction()}
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
              </CardActions>
            </CardMedia>
          </Tab>
        </Tabs>
      </Card>
    );
  }
}
