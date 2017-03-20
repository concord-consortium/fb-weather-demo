import React, { PropTypes } from "react";
import {Card, CardMedia, CardActions, CardTitle} from "material-ui/Card";
import FloatingActionButton from "material-ui/FloatingActionButton";
import Frames from "../initial-frames";
import MapView from "./map-view";

const FRAMES = Frames();
const NUM_FRAMES = FRAMES.length;

export default class TeacherView extends React.Component {

  static propTypes = {
    frame: PropTypes.number,
    frames: PropTypes.array,
    setFrame: PropTypes.func,
    setFrames: PropTypes.func
  }

  constructor(props){
    super(props);
    this.state = {
      playing: false
    };
  }

  componentDidMount() {
    const setFrames = this.props.setFrames;
    if(setFrames) {
      // TODO: hacky, set the frames after we are loaded avoid some race condition.
      setTimeout(() => setFrames(FRAMES), 2000);
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
    const buttonStyle = {
      // "backgroundColor": "hsl(10,40%,50%)"
    };
    const cardStyle = {
      width: "300px"
    };

    return (
      <Card style={cardStyle}>
        <CardTitle>
          Time: {frame}
        </CardTitle>
        <CardMedia>
          <MapView data={mapData} gridRoster={this.props.gridRoster}/>
        </CardMedia>
        <CardActions>
          <FloatingActionButton
            iconClassName="icon-skip_previous"
            style={buttonStyle}
            onTouchTap={rewind}/>
          <FloatingActionButton
            iconClassName="icon-play_circle_filled"
            disabled={disablePlay}
            style={buttonStyle}
            onTouchTap={play}/>
          <FloatingActionButton
            iconClassName="icon-pause_circle_filled"
            style={buttonStyle}
            disabled={disablePause}
            onTouchTap={pause}/>
        </CardActions>
      </Card>

    );
  }
}
