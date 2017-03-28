import React from "react";
import QueryString from "query-string";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";

import FirebaseImp from "../firebase-imp";
import FrameHelper from "../frame-helper";
import TeacherView from "./teacher-view";
import WeatherStation from "./weather-station-view";
import ClassView from "./class-view";
import ChooseView from "./choose-view";
import NewMap from "./new-map-view";

export default class AppView extends React.Component {
  constructor(props){
    super(props);
    const loadCallback = function() {
      this.setState({
        frames: this.frameHelper.frames
      });
    }.bind(this);
    this.state = {
      frame: 0,
      frames: null,
      session: "default",
      nowShowing: "choose",
      prefs: {
        showBaseMap: false
      }
    };
    this.firebaseImp = new FirebaseImp(this.state.session);

    this.frameHelper = new FrameHelper(loadCallback);
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
    this.firebaseImp.session = session;
    this.firebaseImp.setDataRef();
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

  chooseClassroom() {
    this.updateHashParam("show", "classroom");
  }

  renderNowShowing() {
    const frames = this.state.frames;

    const frame  =  ( this.state || {}).frame;
    const nowShowing = this.state.nowShowing;
    const chooseTeacher = this.chooseTeacher.bind(this);
    const chooseStudent = this.chooseStudent.bind(this);
    const chooseClassroom = this.chooseClassroom.bind(this);
    const gridRoster = {};
    const roster = [];

    let grid = [];
    if (frames && frames.length > 0 && frames[frame].grids) {
      if(frames[frame].grids.default) {
        grid = frames[frame].grids.default;
      }
    }

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
      this.firebaseImp.saveToFirebase({frame: frame});
    }.bind(this);

    const setFrames = function(frames) {
      this.firebaseImp.saveToFirebase({frames: frames});
    }.bind(this);

    const setPrefs = function(prefs) {
      this.firebaseImp.saveToFirebase({prefs: prefs});
    }.bind(this);

    const updateUserData = function(data) {
      this.firebaseImp.saveUserData(data);
    }.bind(this);

    switch(nowShowing){
      case "teacher":
        return(
          <TeacherView
            frame={frame}
            frames={frames}
            grid={grid}
            prefs={this.state.prefs}
            gridRoster={gridRoster}
            setFrame={setFrame}
            setFrames={setFrames}
            setPrefs={setPrefs}
          />
        );

      case "student":
        return(
          <WeatherStation
            frame={frame}
            frames={frames}
            prefs={this.state.prefs}
            updateUserData={updateUserData}
            />
        );

      case "classroom":
        return(<ClassView
          width={600}
          height={600}
          frame={frame}
          frames={frames}
          prefs={this.state.prefs}
          updateUserData={updateUserData}/>);

      default:
        // return(
        //   <NewMap grid={grid} width={500} height={500} showBaseMap={true} showTempColors={true}/>
        // );
        return(<ChooseView
          chooseTeacher={chooseTeacher}
          chooseStudent={chooseStudent}
          chooseClassroom={chooseClassroom}
        />);
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