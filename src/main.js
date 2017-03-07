import React from "react";
import ReactDOM from "react-dom";
import SimControllerView from "./sim-controller-view";
import WeatherStationView from "./weather-station-view";

window.renderController = function(domID){
  ReactDOM.render(<SimControllerView/>, document.getElementById(domID));
};

window.renderStation = function(domID) {
  ReactDOM.render(<WeatherStationView/>, document.getElementById(domID));
};

