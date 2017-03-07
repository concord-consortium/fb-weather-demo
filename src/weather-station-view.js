import React from "react";

const div = React.DOM.div;

export default class WeatherStationView extends React.Component {

  constructor(props){
    super(props);
  }

  componentDidMount() {}
  render() {
    return (
      <div className="WeatherStationView">
        Hello From WeatherStationView
      </div>
    );
  }
}