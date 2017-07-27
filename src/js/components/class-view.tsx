import * as React from "react";
import { Tabs, Tab } from "material-ui/Tabs";
import { Card, CardMedia, CardTitle } from "material-ui/Card";
import { SimPrefs } from "../sim-prefs";
import { LeafletMapView } from "./leaflet-map-view";
import { PredictionShareView } from "./prediction-share-view";
import { ComponentStyleMap } from "../component-style-map";

import { dataStore } from "../data-store";

const styles:ComponentStyleMap = {
  mapAndPrediction: {
    display: "flex",
    flexDirection: "row",
    overflow: "hidden",
    maxWidth: "90vw"
  }
};

export interface ClassViewProps {
  frame: number;
  prefs: SimPrefs;
}

export interface ClassViewstate {}
export class ClassView extends React.Component<ClassViewProps, ClassViewstate> {
  constructor(props: ClassViewProps, ctx: any) {
    super(props);
  }

  render() {
    const time = dataStore.timeString;
    return (
      <Card className="ClassView">
        <Tabs>
          <Tab label="Class View">
            <CardTitle>
              Time: {time}
            </CardTitle>
            <CardMedia
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center"
              }}
            >
              <div style={styles.mapAndPrediction}>
                <LeafletMapView
                  mapConfig={dataStore.mapConfig}
                  interaction={false}
                  baseStations={dataStore.basestations}
                  width={"60vw"}
                  height={"600"}
                />
                <PredictionShareView/>
              </div>
            </CardMedia>
          </Tab>
        </Tabs>
      </Card>
    );
  }
}
