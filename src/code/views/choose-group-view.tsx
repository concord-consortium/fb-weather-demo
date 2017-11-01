import * as React from "react";
import { observer } from "mobx-react";
import { Card, CardTitle, CardText} from "material-ui/Card";
import { Tabs, Tab } from "material-ui/Tabs";
import RaisedButton from "material-ui/RaisedButton";
import { Link } from "react-router";
import { simulationStore } from "../stores/simulation-store";
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

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

const groupOptions = [
  "stallions",
  "pumas",
  "otters",
  "lizards",
  "moles",
  "raccoons",
  "alligators",
  "goats",
  "lambs"
];


@observer
export class ChooseGroupView
  extends React.Component<ChooseGroupProps, ChooseGroupState> {
  constructor(props: ChooseGroupProps, context: any) {
    super(props);
    this.state = {chosenGroup: "" };
  }

  setGroup(event:any, index:number, identifier:string) {
    this.setState({chosenGroup: identifier});
  }


  renderChooseButton() {
    if(this.state.chosenGroup === "") { return <div/>; }
    const simulationName = simulationStore.selected ? simulationStore.selected.name : "choose";
    const path: string = `/simulations/${simulationName}/show/chooseCell`;
    const style = styles.chooseButton;

    return (
      <div>
        <RaisedButton
          primary={true}
          containerElement={<Link to={path}/>}
          >
            <div style={style}>Choose {this.state.chosenGroup}</div>
        </RaisedButton>
      </div>
    );
  }


  render() {

    const optionFor = (animal:string) => <MenuItem value={animal} key={animal} primaryText={animal} />;
    const chooseButton = this.renderChooseButton();
    return (
      <Card style={styles.card}>
        <Tabs>
          <Tab label="Group" value="Group">
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
          </Tab>
        </Tabs>
      </Card>
    );
  }
}
