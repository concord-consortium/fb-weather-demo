import * as React from "react";
import { Card } from "material-ui/Card";
import { Tab, Tabs } from "material-ui/Tabs";
import { SetupStationsView } from "./setup-stations-view";
import { SetupMapView } from "./setup-map-view";

export type SetupViewTab = "stations" | "grids" | "maps";

export interface SetupViewProps {}
export interface SetupViewState {
  tab: SetupViewTab;
}

export class SetupView extends React.Component<SetupViewProps, SetupViewState> {
  interval: any;
  constructor(props: SetupViewProps, ctxt: any) {
    super(props, ctxt);
    this.state = {
      tab: "stations"
    };
  }

  render() {
    const handleChangeTab = (value: SetupViewTab) => {
      this.setState({
        tab: value
      });
    };
    return (
      <Card>
        <Tabs value={this.state.tab} onChange={handleChangeTab}>
          <Tab label="Stations" value="stations">
            <SetupStationsView />
          </Tab>
          {/* TODO: We might want to re-enable grids later.
          <Tab label="Grids" value="grid">
            <SetupGridView  />
          </Tab>
          */}
          <Tab label="Map" value="configure">
            <SetupMapView />
          </Tab>
        </Tabs>
      </Card>
    );
  }
}
