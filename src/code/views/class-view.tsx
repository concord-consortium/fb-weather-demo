import * as React from "react";
import { Tabs, Tab } from "material-ui/Tabs";
import { Card, CardMedia, CardTitle } from "material-ui/Card";
import { LeafletMapView } from "./leaflet-map-view";
import { simulationStore } from "../stores/simulation-store";

export interface ClassViewProps {}
export interface ClassViewState {}

export class ClassView extends React.Component<ClassViewProps, ClassViewState> {
  constructor(props: ClassViewProps, ctx: any) {
    super(props);
  }

  render() {
    const time = simulationStore.timeString,
          weatherStations = (simulationStore.stations && simulationStore.stations.stations) || [];
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
                mapConfig={simulationStore.mapConfig}
                interaction={false}
                weatherStations={weatherStations}
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
