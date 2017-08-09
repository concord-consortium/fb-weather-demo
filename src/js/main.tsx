import * as React from "react";
import * as ReactDOM from "react-dom";
import { AppView } from "./components/app-view";
import { Router, Route, hashHistory, IndexRedirect } from "react-router";
import * as injectTapEventPlugin from "react-tap-event-plugin";
import { gFirebase, FirebaseImp } from "./firebase-imp";

import { TeacherView } from "./components/teacher-view";
import { WeatherStationView } from "./components/weather-station-view";
import { ClassView } from "./components/class-view";
import { ChooseView } from "./components/choose-view";
import { ChooseSimulationView } from "./components/choose-simulation-view";
import { SetupView } from "./components/setup-view";
import { simulationStore } from "./stores/simulation-store";

injectTapEventPlugin();

const log = function(msg: string) {
  console.log(msg);
};

const updateSession = function(nextSimulation: string) {
  if (nextSimulation && nextSimulation !== gFirebase.session) {
    if(simulationStore.selectByName(nextSimulation)) {
      const logString = `
        ================================================
        Changed Simulation path to: ${nextSimulation}
        ================================================
      `;
      log(logString);
    }
    else {
      hashHistory.push('/simulations/choose');
    }
  }
};

const simulationChanged = function(
  prevState: any,
  nextState: any,
  replace: any,
  callback: Function | undefined
) {
  updateSession(nextState.params.simulationName);
  if (callback) {
    callback();
  }
};

const onEnter = function(
  nextState: any,
  replace: any,
  callback: Function | undefined
) {
  updateSession(nextState.params.simulationName);
  if (callback) {
    callback();
  }
};

gFirebase.postConnect.then( (imp:FirebaseImp)=> {
  ReactDOM.render(
    <Router history={hashHistory}>
      <Route
        path="/"
        component={AppView}
        onChange={simulationChanged}
        onEnter={onEnter}
      >
        <IndexRedirect to="/simulations" />
        <Route path="/simulations">
          <IndexRedirect to="choose" />
          <Route path="choose" component={ChooseSimulationView} />
          <Route path="/simulations/:simulationName">
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
});
