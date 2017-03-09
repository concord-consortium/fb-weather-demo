import React from "react";

import SimController from "./sim-controller-view";
import WeatherStation from "./weather-station-view";
import FirebaseImp from "./firebase-imp";
import QueryString from "query-string";

const div = React.DOM.div;

export default class AppView extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      frame: 0,
      frames: null,
      session: "default",
      nowShowing: "choose"
    };
    this.firebaseImp = new FirebaseImp(this.state.session);
  }

  componentDidMount() {
    const qparams = QueryString.parse(location.search);
    const nowShowing = qparams.show || "choose";
    const session    = qparams.session || "default";
    this.registerFirebase();
    this.firebaseImp.setDataRef(session);
    this.setState(
      {
        session: session,
        nowShowing: nowShowing
      }
    );
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
    const frame  =  ( this.state || {}).frame;
    const nowShowing = this.state.nowShowing;

    const setFrame = function(frame) {
      this.firebaseImp.update({frame: frame});
    }.bind(this);

    const setFrames = function(frames) {
      this.firebaseImp.update({frames: frames});
    }.bind(this);

    switch(nowShowing){
      case "teacher":
        return(
          <SimController
            frame={frame}
            frames={frames}
            setFrame={setFrame}
            setFrames={setFrames}
          />
        );

      case "student":
        return(
          <WeatherStation
            frame={frame}
            frames={frames}
         />
        );

      default:
        return(
          <div className="choose"> Choose teacher or student </div>
        );
    }
  }
}