import * as React from "react";
import { observer } from "mobx-react";

import { CardTitle, CardText} from "material-ui/Card";
import RaisedButton from "material-ui/RaisedButton";
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import {IGroup} from "../models/group";
import { simulationStore } from "../models/simulation";
import { ComponentStyleMap } from "../utilities/component-style-map";

export type StationTab = "configure" | "weather";

export interface ChooseGroupProps {
  onDone: () => void;
}
export interface ChooseGroupState {
  chosenGroup: string;
}

const styles: ComponentStyleMap = {
  card: {
  },
  chooseButton: {
    color: "white",
    margin: "0.25em",
    fontWeight: "bold"
  }
};

@observer
export class ChooseGroupView
  extends React.Component<ChooseGroupProps, ChooseGroupState> {
  constructor(props: ChooseGroupProps, context: any) {
    super(props);
    const simulation = simulationStore.selected,
          chosenGroup = simulation && simulation.groupName || "";
    this.state = {chosenGroup: chosenGroup};
  }

  setGroup(event:any, index:number, name:string) {
    this.setState({chosenGroup: name});
    const simulation = simulationStore.selected,
          presence = simulation && simulation.selectedPresence;
    if(presence) {
      presence.setGroupName(name);
    }
  }


  renderChooseButton() {
    if(this.state.chosenGroup === "") { return <div/>; }
    const style = styles.chooseButton;
    const {onDone} = this.props;
    return (
      <div>
        <RaisedButton primary={true} onClick={onDone}>
            <div style={style}>Choose {this.state.chosenGroup}</div>
        </RaisedButton>
      </div>
    );
  }


  render() {

    const optionFor = (group:string) => {
                        return  <MenuItem value={group} key={group} primaryText={group} />;
                      },
          chooseButton = this.renderChooseButton(),
          simulation = simulationStore.selected,
          availableGroups = simulation && simulation.availableGroups,
          selectedGroup = simulation && simulation.selectedGroup;
    let groupOptions:string[] = [];
    if(availableGroups) {
      groupOptions = availableGroups.map((g:IGroup) => g.name);
      if(selectedGroup) {
        groupOptions.push(selectedGroup.name);
      }
    }

    return (
      <div>
        <CardTitle>Select your Group</CardTitle>
        <CardText>
          <SelectField
            floatingLabelText="Team Name"
            value={this.state.chosenGroup}
            onChange={ (e,i,v) => this.setGroup(e,i,v) }
          >
            { groupOptions.map( opt => optionFor(opt)) }
          </SelectField>
          { chooseButton }
        </CardText>
      </div>
    );
  }
}
