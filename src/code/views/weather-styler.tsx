import * as React from "react";
import { IWeatherStation } from "../models/weather-station";

export function weatherColor(station?:IWeatherStation|null) {
  const coldColor = "#50a9fa";
  const hotColor = "#f05042";
  const normColor = "#f9b33a";

  const hotTemp = 25;
  const coldTemp = 15;

  if(station && station.temperature) {
    if(station.temperature > hotTemp) { return hotColor; }
    if(station.temperature > coldTemp) { return normColor; }
    return coldColor;
  }
  return normColor;
}

export function precipDiv(station?:IWeatherStation|null) {
  const rainColor = "#6B4747";
  const sunColor = "#8D7927";
  const raining = station && station.precipitation;
  const fontColor = raining ? rainColor : sunColor;
  const style = { color: fontColor };
  const rainIcon = "icon-cloud-rain";
  // const sunIcon = "icon-sun";
  const sunIcon = "";
  const className = raining ?  rainIcon : sunIcon;
  return ( <i className={className} style={style} /> );
}
