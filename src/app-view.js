import React from "react";

import SimController from "./sim-controller-view";
import WeatherStation from "./weather-station-view";
import FirebaseImp from "./firebase-imp";
const div = React.DOM.div;

export default class AppView extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      frame: 0,
      frames: null
    };
    this.firebaseImp = new FirebaseImp("dev");
  }

  componentDidMount() {
    this.registerFirebase();
  }

  componentWillUnmount(){
    this.unregisterFirebase();
    this.firebaseImp.removeListener(this);
  }

  registerFirebase() {
    console.log("firebase registered");
    this.firebaseImp.addListener(this);
    return true;
  }

  unregisterFirebase() {
    console.log("firebase unregistered");
    return true;
  }

  render() {
    const frames = this.state.frames;//  || {}).frames;
    const frame =  ( this.state || {}).frame;
    const setFrame = function(frame) {
      this.firebaseImp.update({frame: frame});
    }.bind(this);
    const setFrames = function(frames) {
      debugger
      this.firebaseImp.update({frames: frames});
    }.bind(this);

    return (
      <div className="SimControllerView">
        Hello From App
        <WeatherStation frame={frame} frames={frames} />
        <SimController  frame={frame} frames={frames} setFrame={setFrame} setFrames={setFrames}/>
      </div>
    );
  }
}