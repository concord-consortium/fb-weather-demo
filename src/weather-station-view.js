import React from "react";

const div = React.DOM.div;

export default class WeatherStationView extends React.Component {

  constructor(props){
    super(props);
  }

  componentDidMount() {}
  render() {
    const frame = this.props.frame;
    const frames = this.props.frames;
    return (
      <div className="WeatherStationView">
        Hello From WeatherStationView
        <div className="frame">{frame}</div>
        <div className="frames">{frames}</div>
      </div>
    );
  }
}