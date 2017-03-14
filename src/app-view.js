import React from "react";

import SimController from "./sim-controller-view";
import WeatherStation from "./weather-station-view";
import FirebaseImp from "./firebase-imp";
import QueryString from "query-string";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import ChooseView from "./choose-view";

// const div = React.DOM.div;

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
    this.registerFirebase();
    this.parseHash();
    window.addEventListener("hashchange", this.parseHash.bind(this));
  }

  parseHash() {
    const qparams = QueryString.parse(location.hash);
    const nowShowing = qparams.show    || "choose";
    const session    = qparams.session || "default";
    this.firebaseImp.setDataRef(session);
    this.setState(
      {
        session: session,
        nowShowing: nowShowing
      }
    );
  }

  updateHashParam(key,value) {
    const qparams = QueryString.parse(location.hash);
    qparams[key]=value;
    const stringified = QueryString.stringify(qparams);
    location.hash = stringified;
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

  chooseStudent() {
    this.updateHashParam("show","student");
  }

  chooseTeacher() {
    this.updateHashParam("show","teacher");
  }

  renderNowShowing() {
    const frames = this.state.frames;
    const frame  =  ( this.state || {}).frame;
    const nowShowing = this.state.nowShowing;
    const chooseTeacher = this.chooseTeacher.bind(this);
    const chooseStudent = this.chooseStudent.bind(this);

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
        return(<WeatherStation frame={frame} frames={frames} />);

      default:
        return(<ChooseView chooseTeacher={chooseTeacher} chooseStudent={chooseStudent}/>);
    }
  }
  render() {
    const showingComponent = this.renderNowShowing();
    return(
      <MuiThemeProvider>
        {showingComponent}
      </MuiThemeProvider>
    );
  }
}