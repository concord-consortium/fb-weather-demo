import React from "react";
import QueryString from "query-string";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";

import FirebaseImp from "../firebase-imp";

import TeacherView from "./teacher-view";
import WeatherStation from "./weather-station-view";
import ChooseView from "./choose-view";

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
    const gridRoster = {};
    const roster = [];
    let   stationRecord;
    for(let id in this.state.presence) {
      stationRecord = this.state.presence[id];
      roster.push(stationRecord);
      if((stationRecord.gridX != undefined) && (stationRecord.gridY != undefined)) {
        if(gridRoster[stationRecord.gridX] == undefined) {
          gridRoster[stationRecord.gridX] = {};
        }
        gridRoster[stationRecord.gridX][stationRecord.gridY] = stationRecord.name;
      }
    }
    
    const setFrame = function(frame) {
      this.firebaseImp.update({frame: frame});
    }.bind(this);

    const setFrames = function(frames) {
      this.firebaseImp.update({frames: frames});
    }.bind(this);

    const updateUserData = function(data) {
      this.firebaseImp.updateUserData(data);
    }.bind(this);

    switch(nowShowing){
      case "teacher":
        return(
          <TeacherView
            frame={frame}
            frames={frames}
            gridRoster={gridRoster}
            setFrame={setFrame}
            setFrames={setFrames}
          />
        );

      case "student":
        return(<WeatherStation frame={frame} frames={frames} updateUserData={updateUserData}/>);

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