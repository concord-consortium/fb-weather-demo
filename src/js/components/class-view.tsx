import * as React from "react";
import { Tabs, Tab } from "material-ui/Tabs";
import { Card, CardMedia } from "material-ui/Card";
import { SimPrefs } from "../sim-prefs";
import { Frame } from "../frame";
import { Grid } from "../grid";   // TODO: Needed?
import { LeafletMapView } from "./leaflet-map-view"
import { dataStore } from "../data-store";


export interface ClassViewProps {
  frame: number
  frames: Frame[]
  grid?: Grid
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
            <CardMedia style={{display: "flex", flexDirection: "column", alignItems: "center" }}>
              <LeafletMapView
                mapConfig={dataStore.mapConfig}
                interaction={false}
                baseStations={dataStore.basestations}
                width={800}
                height={600} />
            </CardMedia>
          </Tab>
        </Tabs>
      </Card>
    );
  }
}
