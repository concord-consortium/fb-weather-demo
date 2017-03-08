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
    return (
      <div className="WeatherStationView">
        Hello From WeatherStationView
        <div className="frame">Frame Number: {frame}</div>
        <MapView data={mapData}/>
      </div>
    );
  }
}