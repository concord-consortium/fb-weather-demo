import * as React from "react";
import { observer } from "mobx-react";
import { Tabs, Tab } from "material-ui/Tabs";
import RaisedButton from "material-ui/RaisedButton";
import { Card } from "material-ui/Card";
import { List, ListItem } from "material-ui/List";
import { Link } from "react-router";
import { dataStore } from "../data-store";

const _ = require("lodash");

interface routeParams {
  sessionName: string;
}

export interface ChooseViewProps {
  params: routeParams;
}

export interface ChooseViewState {}

@observer
export class ChooseView extends React.Component<
  ChooseViewProps,
  ChooseViewState
> {
  constructor(props: ChooseViewProps, ctx: any) {
    super(props);
  }

  linkTo(relativePath: string) {
    const session = this.props.params.sessionName;
    // const path = "x"
    const pathString: string = `/sessions/${session}/${relativePath}`;
    return <Link to={pathString} />;
  }

  render() {
    // firebase?
    const names = dataStore.sessionList;
    const visList = _.map(names, (name: String) => {
      return <ListItem primaryText={name} />;
    });

    return (
      <Card>
        <Tabs>
          <Tab label="Choose Session">
            <List>
              {visList}
            </List>
          </Tab>
        </Tabs>
      </Card>
    );
  }
}
