import React, { PropTypes } from "react";
import Frames from "./initial-frames";
import MapView from "./map-view";
import {Card, CardMedia, CardActions, CardTitle} from "material-ui/Card";
import FloatingActionButton from "material-ui/FloatingActionButton";
import IconButton from "material-ui/IconButton";
import {Toolbar, ToolbarGroup} from "material-ui/ToolBar";

const FRAMES = Frames();
const div = React.DOM.div;
const NUM_FRAMES = FRAMES.length;

export default class SimControllerView extends React.Component {

  static propTypes = {
    frame: PropTypes.number,
    frames: PropTypes.array,
    setFrame: PropTypes.func,
    setFrames: PropTypes.func
  }

  constructor(props){
    super(props);
  }

  componentDidMount() {
    const setFrames = this.props.setFrames;
    // const stringFrames = JSON.stringify(FRAMES);
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
    this.interval = setInterval( () => this.nextFrame(), 1000);
  }

  pause() {
    clearInterval(this.interval);
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
    const buttonStyle = {
      "marginLeft": "1em",
      "backgroundColor": "hsl(10,40%,50%)"
    };
    return (
      <div className="component SimControllerView">
        <div className="title">
          Simulation Controller
        </div>
        <MapView data={mapData}/>
        <Toolbar>
          <ToolbarGroup>
            <FloatingActionButton
              iconClassName="icon-skip_previous"
              style={buttonStyle}
              backgroundColor="hsl(10,40%,50%)"
              onTouchTap={rewind}/>
            <FloatingActionButton
              iconClassName="icon-play_circle_filled"
              backgroundColor="hsl(10,40%,50%)"
              style={buttonStyle}
              onTouchTap={play}/>
            <FloatingActionButton
              iconClassName="icon-pause_circle_filled"
              backgroundColor="hsl(10,40%,50%)"
              style={buttonStyle}
              onTouchTap={pause}/>
          </ToolbarGroup>
        </Toolbar>
      </div>

    );
  }
}
