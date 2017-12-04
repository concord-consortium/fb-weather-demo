import * as React from "react";
import { observer } from "mobx-react";
import * as _ from "lodash";

import { Card, CardText} from "material-ui/Card";
import { Tab, Tabs } from "material-ui/Tabs";

import { ChooseGroupView } from "./choose-group-view";
import { ChooseCellView } from "./choose-cell-view";
import { WeatherStationView } from "./weather-station-view";
import { ComponentStyleMap } from "../utilities/component-style-map";
import { simulationStore } from "../models/simulation";


enum StudentTab {
  GroupTab   = "Choose Group",
  CellTab    = "Choose Location",
  WeatherTab = "Current Weather"
}

export interface StudentTabsProps {
}

export interface StudentTabsState {
  selectedTab: StudentTab | undefined;
}

@observer
export class StudentTabsView extends React.Component<
                                          StudentTabsProps,
                                          StudentTabsState> {
  constructor(props: StudentTabsProps, context: any) {
    super(props);
    this.state = {
      selectedTab: _.last(this.enabledTabs())
    };
  }

  enabledTabs() {
    const simulation = simulationStore.selected;
    const group = simulation.selectedGroup;
    const weatherStation = simulation.presenceStation;
    if(!group) {
      return [StudentTab.GroupTab];
    }
    if(!weatherStation) {
      return [StudentTab.GroupTab, StudentTab.CellTab];
    }
    return [StudentTab.GroupTab, StudentTab.CellTab, StudentTab.WeatherTab];
  }

  render() {
    const styles: ComponentStyleMap = {
      card: {
      },
      media: {
      },
    };

    const handleChangeTab = (newTab: StudentTab) => {
      this.setState({selectedTab: newTab});
    };
    const simulation = simulationStore.selected;
    const enabledTabs = this.enabledTabs();
    const disabled = (tab:StudentTab) => ! _.includes(enabledTabs, tab);
    const cellDisabled    = disabled(StudentTab.CellTab);
    const weatherDisabled = disabled(StudentTab.WeatherTab);
    const groupTabLabel   = simulation.groupName || StudentTab.GroupTab;
    const weatherTabLabel = weatherDisabled ? "––" : "Current Conditions";
    const cellTabLabel    =
      (simulation.presenceStation && `Location: ${simulation.presenceStation.name}`)
      || StudentTab.CellTab;
    const onGroupChosen = () => {
      const simulation = simulationStore.selected;
      const presence = simulation.selectedPresence;
      if(presence) {
        presence.setStationId("");
        this.setState({selectedTab: StudentTab.CellTab});
      }
    };
    return (
      <Card style={styles.card}>
        <Tabs value={this.state.selectedTab} onChange={handleChangeTab}>
          <Tab label={groupTabLabel} value={StudentTab.GroupTab}>
            <ChooseGroupView onDone={onGroupChosen}/>
          </Tab>
          <Tab label={cellTabLabel} disabled={cellDisabled} value={StudentTab.CellTab}>
            <ChooseCellView />
          </Tab>
          <Tab
            label={weatherTabLabel} disabled={weatherDisabled} value={StudentTab.WeatherTab}>
            <CardText>
              <WeatherStationView weatherStation={simulation.presenceStation} />
            </CardText>
          </Tab>
        </Tabs>
      </Card>
    );
  }
}
