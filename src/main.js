import React from "react";
import ReactDOM from "react-dom";
import AppView from "./app-view";
import injectTapEventPlugin from "react-tap-event-plugin";


injectTapEventPlugin();

ReactDOM.render(<AppView/>, document.getElementById("App"));
