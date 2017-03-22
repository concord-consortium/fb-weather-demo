import React, { PropTypes } from "react";
import NewMapView from "./new-map-view";
import {Tabs, Tab} from "material-ui/Tabs";
import {Card, CardText} from "material-ui/Card";
export default class ClassView extends React.Component {

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
                showMap={true}
                showGrid={true}
              />
            </CardText>
          </Tab>
        </Tabs>
      </Card>
    );
  }
}
