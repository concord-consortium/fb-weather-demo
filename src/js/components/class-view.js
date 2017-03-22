import React, { PropTypes } from "react";
import NewMapView from "./new-map-view";
import {Tabs, Tab} from "material-ui/Tabs";
import {Card, CardText} from "material-ui/Card";



export default class ClassView extends React.Component {

  static propTypes = {
    frame: PropTypes.number,
    frames: PropTypes.array,
    prefs: PropTypes.object
  }

  constructor(props){
    super(props);
  }

  render() {
    return (
      <Card className="ClassView">
        <Tabs>
          <Tab label="Class View" >
            <CardText>
              <NewMapView
                width={600}
                height={600}
                showBaseMap={this.props.prefs.showBaseMap}
                showGridLines={this.props.prefs.showGridLines}
                showTempColors={this.props.prefs.showTempColors}
                showTempValues={this.props.prefs.showTempValues}
              />
            </CardText>
          </Tab>
        </Tabs>
      </Card>
    );
  }
}
