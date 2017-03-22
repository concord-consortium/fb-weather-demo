import React, { PropTypes } from "react";
import {Card, CardText, CardMedia, CardActions, CardTitle} from "material-ui/Card";
import {Tab, Tabs} from "material-ui/Tabs";
import Toggle from "material-ui/Toggle";
import FloatingActionButton from "material-ui/FloatingActionButton";
import Frames from "../initial-frames";
import MapView from "./map-view";

const FRAMES = Frames();
const NUM_FRAMES = FRAMES.length;

export default class TeacherView extends React.Component {

  static propTypes = {
    frame: PropTypes.number,
    frames: PropTypes.array,
    gridRoster: PropTypes.array,
    setFrame: PropTypes.func,
    setFrames: PropTypes.func
  }

  constructor(props){
    super(props);
    this.state = {
      playing: false,
      frameRate: 2000,
      tab: "control"
    };
  }

  componentDidMount() {
    const setFrames = this.props.setFrames;
    const frameRate = this.state.frameRate;
    if(setFrames) {
      // TODO: hacky, set the frames after we are loaded avoid some race condition.
      setTimeout(() => setFrames(FRAMES), frameRate);
    }
  }

  nextFrame(){
    let frameNumber = (this.props.frame || 0) + 1;
    frameNumber = frameNumber % NUM_FRAMES;
    this.props.setFrame(frameNumber);
  }

  play() {
    if(this.interval) {
      clearInterval(this.interval);
    }
    this.interval = setInterval( () => this.nextFrame(), 1000);
    this.setState({playing: true});
  }

  pause() {
    clearInterval(this.interval);
    this.interval = null;
    this.setState({playing: false});
  }

  rewind() {
    this.props.setFrame(0);
  }

  render() {
    const rewind = this.rewind.bind(this);
    const play   = this.play.bind(this);
    const pause  = this.pause.bind(this);

    const frame = this.props.frame;
    const frames = this.props.frames;
    const mapData = frames ?  frames[frame] : [ [0,0,0], [0,0,0], [0,0,0] ];
    const disablePlay = !! this.interval;
    const disablePause = ! disablePlay;

    const handleChangeTab = (value) => {
      this.setState({
        tab: value,
      });
    };
    const styles = {
      block: {
        maxWidth: 250,
      },
      toggle: {
        marginBottom: 16,
      },
      thumbOff: {
        backgroundColor: "#ffcccc",
      },
      trackOff: {
        backgroundColor: "#ff9d9d",
      },
      thumbSwitched: {
        backgroundColor: "red",
      },
      trackSwitched: {
        backgroundColor: "#ff9d9d",
      },
      labelStyle: {
        color: "red",
      },
      button: {}
    };
    return(
      <Card>
         <Tabs value={this.state.tab} onChange={handleChangeTab}>
          <Tab label="Configure" value="configure">
            <CardText>
              <div className="toggles" style={styles.block}>
                <Toggle
                  label="Base map"
                  style={styles.toggle}
                />
                <Toggle
                  label="Grid lines"
                  style={styles.toggle}
                />
                <Toggle
                  label="Temp values"
                  style={styles.toggle}
                />
                <Toggle
                  label="Temp colors"
                  style={styles.toggle}
                />
                <Toggle
                  label="Group names"
                  style={styles.toggle}
                />
                <Toggle
                  label="Enable prediction"
                  style={styles.toggle}
                />
              </div>
            </CardText>
          </Tab>
          <Tab label="Control" value="control">
            <CardTitle>
              Time: {frame}
            </CardTitle>
            <CardMedia>
              <MapView data={mapData} gridRoster={this.props.gridRoster}/>
            </CardMedia>
            <CardActions>
              <FloatingActionButton
                iconClassName="icon-skip_previous"
                style={styles.button}
                onTouchTap={rewind}/>
              <FloatingActionButton
                iconClassName="icon-play_circle_filled"
                disabled={disablePlay}
                style={styles.button}
                onTouchTap={play}/>
              <FloatingActionButton
                iconClassName="icon-pause_circle_filled"
                style={styles.button}
                disabled={disablePause}
                onTouchTap={pause}/>
            </CardActions>
          </Tab>
        </Tabs>
      </Card>

    );
  }
}
