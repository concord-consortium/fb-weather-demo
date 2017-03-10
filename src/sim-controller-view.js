import React, { PropTypes } from "react";
import Frames from "./initial-frames";
import MapView from "./map-view";

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
  render() {
    const setFrame = this.props.setFrame;
    const nextFrame = function(){
      let frameNumber = (this.props.frame || 0) + 1;
      frameNumber = frameNumber % NUM_FRAMES;
      setFrame(frameNumber);
    };
    const frame = this.props.frame;
    const frames = this.props.frames;
    const mapData = frames ?  frames[frame] : [ [0,0,0], [0,0,0], [0,0,0] ];
    return (
      <div className="SimControllerView component">

        <div className="id"> Sumulation Controller: </div>
        <MapView data={mapData}/>
        <div className="controls">
          <button name="next" className="next-frame" value="next" onClick={nextFrame.bind(this)}> Next Frame </button>
        </div>
      </div>

    );
  }
}
