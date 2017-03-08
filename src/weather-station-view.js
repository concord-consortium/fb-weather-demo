import React from "react";
import MapView from "./map-view";

const div = React.DOM.div;

export default class WeatherStationView extends React.Component {

  constructor(props){
    super(props);
  }

  componentDidMount() {}
  render() {
    const frame = this.props.frame;
    const frames = this.props.frames;
    const mapData = frames ?  frames[frame] : [ [0,0,0], [0,0,0], [0,0,0] ];
    const temp = mapData[1][1];
    return (
      <div className="WeatherStationView component">
        <div className="id"> Weather Station (B,2) </div>
        <div className="temp"> Temperature = {temp}°</div>
      </div>
    );
  }
}