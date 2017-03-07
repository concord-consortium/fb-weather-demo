import React from "react";

const div = React.DOM.div;

export default class SimControllerView extends React.Component {

  constructor(props){
    super(props);
  }

  componentDidMount() {}
  render() {
    return (
      <div className="SimControllerView">
        Hello From SimControllerView
      </div>
    );
  }
}