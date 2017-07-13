import * as React from "react";
import { ComponentStyleMap } from "../component-style-map";
import { Tab, Tabs } from "material-ui/Tabs";
import { TeacherSetupStationsView } from "./teacher-setup-stations-view";
import { TeacherSetupGridView } from "./teacher-setup-grid-view";

const div = React.DOM.div;
type SetupTab = "stations" | "grid";

export interface TeacherSetupState {
  tab: SetupTab;
}
export interface TeacherSetupProps {}

const styles: ComponentStyleMap = {};

export class TeacherSetupView extends React.Component<
  TeacherSetupProps,
  TeacherSetupState
> {
  constructor(props: TeacherSetupProps, ctx: any) {
    super(props, ctx);
    this.state = {
      tab: "stations"
    };
  }

  render() {
    const handleChangeTab = (value: SetupTab) => {
      this.setState({
        tab: value
      });
    };
    return (
      <Tabs value={this.state.tab} onChange={handleChangeTab}>
        <Tab label="Stations" value="stations">
          <TeacherSetupStationsView />
        </Tab>
        <Tab label="Grid" value="grid">
          <TeacherSetupGridView />
        </Tab>
      </Tabs>
    );
  }
}
