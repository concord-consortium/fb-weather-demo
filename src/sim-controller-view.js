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
    if(setFrames) {
      setFrames(FRAMES);
    }
    debugger;
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