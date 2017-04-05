import * as React from "react";
import * as QueryString from "query-string";
import {observer} from 'mobx-react';
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";

import { FrameHelper } from "../frame-helper";
import { Presence } from "../presence"
import { TeacherView } from "./teacher-view";
import { WeatherStationView } from "./weather-station-view";
import { ClassView } from "./class-view";
import { ChooseView } from "./choose-view";

import { dataStore } from "../data-store";
import { Grid } from "../grid";

export type ShowingType = "choose" | "teacher" | "classroom" | "student";

export interface AppViewProps {}
export interface AppViewState {
  session: string
  presence?: Presence
}

@observer
export class AppView extends React.Component<AppViewProps, AppViewState> {
  frameHelper: FrameHelper
  public state:AppViewState

  constructor(props:AppViewProps){
    super(props);
    this.state = {
      session: "default"
    };
    const loadCallback = function() {
      dataStore.setFrame(0);
      dataStore.setFrames(this.frameHelper.frames);
      this.setState({
        session: "default",
        prefs: {
          showBaseMap: false
        }
      });
    }.bind(this);

    this.frameHelper = new FrameHelper(loadCallback);
  }

  componentDidMount() {
    this.parseHash();
    window.addEventListener("hashchange", this.parseHash.bind(this));
  }

  parseHash() {
    const qparams = QueryString.parse(location.hash);
    const nowShowing = qparams.show    || "choose";
    const session    = qparams.session || "default";
    dataStore.setNowShowing(nowShowing)
    dataStore.setSession(session)
    this.setState(
      {
        session: session
      }
    );
  }

  updateHashParam(key:string, value:string) {
    const qparams = QueryString.parse(location.hash);
    qparams[key]=value;
    const stringified = QueryString.stringify(qparams);
    location.hash = stringified;
  }

  componentWillUnmount(){
    dataStore.unregisterFirebase();
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
    const frames = dataStore.frames
    const frame  = dataStore.frame
    const nowShowing = dataStore.nowShowing;
    const gridName = dataStore.prefs.gridName;
    const gridNames = dataStore.prefs.gridNames;
    const chooseTeacher = this.chooseTeacher.bind(this);
    const chooseStudent = this.chooseStudent.bind(this);
    const chooseClassroom = this.chooseClassroom.bind(this);
    const gridRoster = {};
    const roster: string[] = [];

    let grid:Grid | undefined = undefined;
    if (frames && frames.length > 0 && frames[frame].grids) {
      if(frames[frame].grids[gridName]) {
        grid = frames[frame].grids[gridName];
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
            gridName={gridName}
            gridNames={gridNames}
            gridRoster={gridRoster}
            prefs={dataStore.prefs}
            setFrame={dataStore.setFrame}
            setFrames={dataStore.setFrames}
            setPrefs={dataStore.setPrefs.bind(dataStore)}
          />
        );

      case "student":
        return(
          <WeatherStationView
            prefs={dataStore.prefs}
            />
        );

      case "classroom":
        return(<ClassView
          frame={frame}
          frames={frames}
          grid={grid}
          prefs={dataStore.prefs}/>);

      default:
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