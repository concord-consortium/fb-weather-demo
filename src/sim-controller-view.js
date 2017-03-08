import React from "react";
import Frames from "./initial-frames";

const FRAMES = Frames();
const div = React.DOM.div;
const NUM_FRAMES = FRAMES.length;

export default class SimControllerView extends React.Component {

  constructor(props){
    super(props);
  }

  componentDidMount() {
    const setFrames = this.props.setFrames;
    const stringFrames = JSON.stringify(FRAMES);
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
    return (
      <div className="SimControllerView">
        Hello From SimControllerView
        <button name="next" className="next-frame" value="next" onClick={nextFrame.bind(this)}> Next Frame </button>
      </div>

    );
  }
}