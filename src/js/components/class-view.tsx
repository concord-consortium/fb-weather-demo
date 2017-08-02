import * as React from "react";
import { Tabs, Tab } from "material-ui/Tabs";
import { Card, CardMedia, CardTitle } from "material-ui/Card";
import { SimPrefs } from "../sim-prefs";
import { LeafletMapView } from "./leaflet-map-view";
import { dataStore } from "../data-store";
import { weatherStationStore } from "../models/weather-station";

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
              <LeafletMapView
                mapConfig={dataStore.mapConfig}
                interaction={false}
                weatherStations={weatherStationStore.stations}
                width={800}
                height={600}
              />
            </CardMedia>
          </Tab>
        </Tabs>
      </Card>
    );
  }
}
