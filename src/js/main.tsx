import * as React from "react";
import * as ReactDOM from "react-dom";
import { AppView } from "./components/app-view";
import {
  Router,
  Route,
  hashHistory,
  IndexRedirect,
  ChangeHook
} from "react-router";
import * as injectTapEventPlugin from "react-tap-event-plugin";
import { dataStore } from "./data-store";

import { TeacherView } from "./components/teacher-view";
import { WeatherStationView } from "./components/weather-station-view";
import { ClassView } from "./components/class-view";
import { ChooseView } from "./components/choose-view";
import { ChooseSessionView } from "./components/choose-session-view";
import { SetupView } from "./components/setup-view";

injectTapEventPlugin();

const log = function(msg: string) {
  console.log(msg);
};

const updateSession = function(nextSession: string) {
  if (nextSession && nextSession !== dataStore.firebaseImp.session) {
    dataStore.setSession(nextSession);
    const logString = `
      ================================================
      Changed state path to: ${nextSession}
      ================================================
    `;
    log(logString);
  }
};

const sessionChanged = function(
  prevState: any,
  nextState: any,
  replace: any,
  callback: Function | undefined
) {
  updateSession(nextState.params.sessionName);
  if (callback) {
    callback();
  }
};

const onEnter = function(
  nextState: any,
  replace: any,
  callback: Function | undefined
) {
  updateSession(nextState.params.sessionName);
  if (callback) {
    callback();
  }
};

ReactDOM.render(
  <Router history={hashHistory}>
    <Route
      path="/"
      component={AppView}
      onChange={sessionChanged}
      onEnter={onEnter}
    >
      <IndexRedirect to="/sessions" />
      <Route path="/sessions">
        <IndexRedirect to="choose" />
        <Route path="choose" component={ChooseSessionView} />
        <Route path="/sessions/:sessionName">
          <IndexRedirect to="show/choose" />
          <Route path="show">
            <IndexRedirect to="choose" />
            <Route path="student" component={WeatherStationView} />
            <Route path="teacher" component={TeacherView} />
            <Route path="classroom" component={ClassView} />
            <Route path="setup" component={SetupView} />
            <Route path="choose" component={ChooseView} />
          </Route>
        </Route>
      </Route>
    </Route>
  </Router>,
  document.getElementById("App")
);
