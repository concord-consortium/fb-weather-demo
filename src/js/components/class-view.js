import React, { PropTypes } from "react";
import NewMapView from "./new-map-view";

export default class ClassView extends React.Component {

  constructor(props){
    super(props);
  }

  render() {
    return (
      <div className="ClassView">
        <NewMapView
          width={600}
          height={600}
        />
      </div>
    );
  }
}
