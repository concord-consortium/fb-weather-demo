import * as React from "react";
import { observer } from "mobx-react";

import { CardTitle, CardText} from "material-ui/Card";
import RaisedButton from "material-ui/RaisedButton";
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import {IGroup} from "../models/group";
import { simulationStore } from "../stores/simulation-store";
import { ComponentStyleMap } from "../utilities/component-style-map";

export type StationTab = "configure" | "weather";

export interface ChooseGroupProps {
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
    this.state = {chosenGroup: "" };
  }

  setGroup(event:any, index:number, name:string) {
    this.setState({chosenGroup: name});
    const presence = simulationStore.selectedPresence;
    if(presence) {
      presence.setGroupName(name);
    }
  }


  renderChooseButton() {
    if(this.state.chosenGroup === "") { return <div/>; }
    const style = styles.chooseButton;

    return (
      <div>
        <RaisedButton primary={true}>
            <div style={style}>Choose {this.state.chosenGroup}</div>
        </RaisedButton>
      </div>
    );
  }


  render() {

    const optionFor = (animal:string) => {
      return  <MenuItem value={animal} key={animal} primaryText={animal} />;
    };
    const chooseButton = this.renderChooseButton();
    const availableGroups = simulationStore.availableGroups;
    const selectedGroup = simulationStore.selectedGroup;
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
            floatingLabelText="Group Name"
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
