import * as React from "react";
import * as ReactDOM from "react-dom";
import { AppView } from "./views/app-view";
import { Router, Route, hashHistory, IndexRedirect } from "react-router";
import * as injectTapEventPlugin from "react-tap-event-plugin";
import { gFirebase, FirebaseImp } from "./middleware/firebase-imp";

import { TeacherView } from "./views/teacher-view";
// import { WeatherStationView } from "./views/weather-station-view";
import { StudentTabsView } from "./views/student-tabs-view";
// import { ClassView } from "./views/class-view";
// import { ChooseView } from "./views/choose-view";
import { PortalView } from "./views/portal-view";
// import { ChooseSimulationView } from "./views/choose-simulation-view";
// import { SetupGridView } from "./views/setup-grid-view";
import { simulationStore } from "./models/simulation";

require("!style-loader!css-loader!leaflet/dist/leaflet.css");
require("!style-loader!css-loader!../html/loading.css");
require("!style-loader!css-loader!../html/weather.css");

injectTapEventPlugin();

const log = function(msg: string) {
  console.log(msg);
};



gFirebase.postConnect.then( (imp:FirebaseImp)=> {
  imp.dataRef.once('value').then((snapshot:any) => {

    const updateSession = function (nextSimulation: string, callback?: () => void) {
      if (nextSimulation) {
        simulationStore.select(nextSimulation);
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
      if (callback) { callback(); }
    };

    const simulationChanged = function (
      prevState: any,
      nextState: any,
      replace: any,
      callback: () => void | undefined
    ) {
      updateSession(nextState.params.simulationName, callback);
    };

    const setTeacherMode = function (
      nextState: any,
      replace: any,
      callback: () => void | undefined
    ) {
      const simulationName = nextState.params.simulationName;
      if (simulationName) {
        updateSession(simulationName);
      }
      const simulation = simulationStore.selected;
      if (simulation) {
        simulation.setIsTeacherView(true);
      }
      if(callback) { callback(); }
    };

    const setStudentMode = function (
      nextState: any,
      replace: any,
      callback: () => void | undefined
    ) {
      const simulationName = nextState.params.simulationName;
      if (simulationName) {
        // students must wait until teacher has started simulation
        gFirebase.waitForPathToExist(`simulations/${simulationName}`, (snapshot: any) => {
          updateSession(simulationName);
          const simulation = simulationStore.selected;
          if (simulation) {
            simulation.setIsTeacherView(false);
          }
        });
      }
      if(callback) { callback(); }
    };

    ReactDOM.render(
      <Router history={hashHistory}>
        <Route
          path="/"
          component={AppView}
        >
          <IndexRedirect to="/portal-launch" />
          <Route path="/portal-launch" component={PortalView} />
          <Route path="/simulations" onChange={simulationChanged}>
            {/* <IndexRedirect to="choose" /> */}
            {/* <Route path="choose" component={ChooseSimulationView} /> */}
            <Route path="/simulations/:simulationName">
              {/* <IndexRedirect to="show/teacher" /> */}
              <Route path="show">
                <IndexRedirect to="teacher" />
                <Route path="student" onEnter={setStudentMode} component={StudentTabsView} />
                {/* <Route path="chooseCell" component={StudentTabsView} />
                <Route path="station" component={WeatherStationView} /> */}
                <Route path="teacher" onEnter={setTeacherMode} component={TeacherView} />
                {/* <Route path="classroom" component={ClassView} /> */}
                {/* <Route path="setup" component={SetupGridView} /> */}
                {/* <Route path="choose" component={ChooseView} /> */}
              </Route>
            </Route>
          </Route>
        </Route>
      </Router>,
      document.getElementById("App")
    );
  });
});
