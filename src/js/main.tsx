import * as React from "react";
import * as ReactDOM from "react-dom";
import { AppView } from "./components/app-view";
import { TestView } from "./components/test-view";
import { BlargView } from "./components/blarg-view";
import { Router, Route, hashHistory, IndexRedirect, ChangeHook} from 'react-router'
import * as injectTapEventPlugin from "react-tap-event-plugin";
import { dataStore } from "./data-store";

import { TeacherView } from "./components/teacher-view";
import { WeatherStationView } from "./components/weather-station-view";
import { ClassView } from "./components/class-view";
import { ChooseView } from "./components/choose-view";
import { SetupView } from "./components/setup-view";

injectTapEventPlugin();

const sessionChanged:ChangeHook = function(prevState:any, nextState:any, replace:any, callback:Function | undefined) {
  const lastSession = prevState.params.sessionName
  const nextSession = nextState.params.sessionName
  if (nextSession != lastSession) {
    dataStore.setSession(nextSession);
  }
  console.log(nextState);
  if(callback) {
    callback();
  }
}

ReactDOM.render((
  <Router history={hashHistory}>
    <Route path="/" component={AppView}  onChange={sessionChanged}>
      <IndexRedirect to="/sessions/default" />
      <Route path="/sessions/:sessionName">
        <IndexRedirect to="show/choose" />
        <Route path="show/student" component={WeatherStationView} />
        <Route path="show/teacher" component={TeacherView} />
        <Route path="show/classroom" component={ClassView} />
        <Route path="show/setup" component={SetupView} />
        <Route path="show/choose" component={ChooseView} />
        <Route path="show/test" component={TestView}>
          <Route path="blarg/:blarg" component={BlargView} onChange={sessionChanged}/>
        </Route>
      </Route>
    </Route>
  </Router>
), document.getElementById('App'))
