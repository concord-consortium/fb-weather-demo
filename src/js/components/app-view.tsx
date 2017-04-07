import * as React from "react";
import {observer} from 'mobx-react';
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import DevTools from "mobx-react-devtools";

import { Presence } from "../presence"
import { TeacherView } from "./teacher-view";
import { WeatherStationView } from "./weather-station-view";
import { ClassView } from "./class-view";
import { ChooseView } from "./choose-view";

import { dataStore } from "../data-store";

export type ShowingType = "choose" | "teacher" | "classroom" | "student";

export interface AppViewProps {}
export interface AppViewState {
  session: string
  presence?: Presence
}

@observer
export class AppView extends React.Component<AppViewProps, AppViewState> {
  public state:AppViewState

  constructor(props:AppViewProps){
    super(props);
    this.state = {
      session: "default"
    };
  }

  renderNowShowing() {
    const frames = dataStore.frames
    const frame  = dataStore.frame
    const nowShowing = dataStore.nowShowing;
    const roster: string[] = [];

    switch(nowShowing){
      case "teacher":
        return(
          <TeacherView />
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
          grid={dataStore.grid}
          prefs={dataStore.prefs}/>);

      default:
        return(<ChooseView/>);
    }
  }
  render() {
    const showingComponent = this.renderNowShowing();
    return(
      <MuiThemeProvider>
        <div>
          {showingComponent}
          {/*<DevTools />*/}
        </div>
      </MuiThemeProvider>
    );
  }
}