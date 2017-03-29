import * as React from "react";
import { MapView } from "./map-view";
import { Tabs, Tab } from "material-ui/Tabs";
import { Card, CardText } from "material-ui/Card";
import { SimPrefs } from "../sim-prefs";
import { Frame } from "../frame";

export interface ClassViewProps {
  frame: number
  frames: Frame[]
  grid?: number[][]
  prefs: SimPrefs
}

export interface ClassViewstate { }
export class ClassView extends React.Component<ClassViewProps, ClassViewstate> {

  constructor(props:ClassViewProps, ctx:any){
    super(props);
  }

  render() {
    return (
      <Card className="ClassView">
        <Tabs>
          <Tab label="Class View" >
            <CardText>
              <MapView
                width={600}
                height={600}
                grid={this.props.grid}
                prefs={this.props.prefs}
              />
            </CardText>
          </Tab>
        </Tabs>
      </Card>
    );
  }
}
