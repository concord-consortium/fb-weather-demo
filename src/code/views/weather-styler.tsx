import * as React from "react";
import { IWeatherStation } from "../models/weather-station";

export function weatherColor(station?:IWeatherStation|null) {
  const coldColor = "#50a9fa";
  const hotColor = "#f05042";
  const normColor = "#f9b33a";

  const hotTemp = 22.5;
  const coldTemp = 17.5;

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
  const style: React.CSSProperties = { position: 'relative', zIndex: 2, color: fontColor };
  const rainIcons = [
    "",
    "icon-cloud",
    "icon-cloud-drizzle",
    "icon-cloud-rain"]
    ;
  // const sunIcon = "icon-sun";
  const index = station && station.precipitation ? station.precipitation : 0;
  const className = rainIcons[index];
  // return ( <span>{station.precipitation}</span> );
  return ( <i className={className} style={style} /> );
}
