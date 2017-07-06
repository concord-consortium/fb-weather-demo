import * as React from "react";
import * as ReactDOM from "react-dom";
import { AppView } from "./components/app-view";
import { TestView } from "./components/test-view";
import { BlargView } from "./components/blarg-view";
import { Router, Route, hashHistory, IndexRedirect } from 'react-router'
import * as injectTapEventPlugin from "react-tap-event-plugin";


injectTapEventPlugin();

// ReactDOM.render(<AppView/>, document.getElementById("App"));

ReactDOM.render((
  <Router history={hashHistory}>
    <Route path="/" component={AppView}>
      <IndexRedirect to="/sessions/default" />
      <Route path="/sessions/:sessionName" component={AppView} />
    </Route>
    <Route path="/test" component={TestView}>
      <Route path="blarg/:blarg" component={BlargView}/>
    </Route>
  </Router>
), document.getElementById('App'))
