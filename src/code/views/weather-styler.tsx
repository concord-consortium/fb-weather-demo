import * as React from "react";
import { IWeatherStation } from "../models/weather-station";

const normColor = "#f9b33a";

function threeBandColor(tempInC: number) {
  const coldColor = "#50a9fa";
  const hotColor = "#f05042";
  const hotTemp = 22.5;
  const coldTemp = 17.5;

  if(tempInC > hotTemp) { return hotColor; }
  if(tempInC > coldTemp) { return normColor; }
  return coldColor;
}

function sixBandColor(tempInC: number) {
  const bands = [
    {min: -12.2, max: -6.7, color: "purple"},
    {min: -6.7,  max: -1.1, color: "blue"},
    {min: -1.1,  max: 4.4,  color: "green"},
    {min: 4.4,   max: 10,   color: "yellow"},
    {min: 10,    max: 15.6, color: "orange"},
    {min: 15.6,  max: 20.6, color: "red"},
  ];

  for (let i = 0; i < bands.length; i++) {
    const band = bands[i];
    if ((tempInC >= band.min) && (tempInC < band.max)) {
      return band.color;
    }
  }

  return normColor;
}

export function weatherColor(station?:IWeatherStation|null) {
  if(station) {
    const {temperature, tempConfig} = station;
    if ((temperature !== null) && (tempConfig !== null)) {
      switch (tempConfig.bandModel) {
        case "three-bands":
          return threeBandColor(temperature.value.C);
        case "six-bands":
          return sixBandColor(temperature.value.C);
      }
    }
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
    "raindrops-one",
    "raindrops-two",
    "raindrops-three"
  ];
  // const sunIcon = "icon-sun";
  const index = station && station.precipitation ? station.precipitation : 0;
  const className = rainIcons[index];
  // return ( <span>{station.precipitation}</span> );
  return ( <i className={className} style={style} /> );
}

