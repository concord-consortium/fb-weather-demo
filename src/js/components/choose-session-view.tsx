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

export interface ChooseSessionViewProps {
  params: routeParams;
}

export interface ChooseSessionViewState {}

@observer
export class ChooseSessionView extends React.Component<
  ChooseSessionViewProps,
  ChooseSessionViewState
> {
  constructor(props: ChooseSessionViewProps, ctx: any) {
    super(props);
  }

  render() {
    // firebase?
    const linkTo = function(relativePath: String) {
      const pathString: string = `/sessions/${relativePath}`;
      return <Link key={pathString} to={pathString} />;
    };
    const names = dataStore.sessionList;
    const visList = _.map(names, (name: String) => {
      return <ListItem primaryText={name} containerElement={linkTo(name)} />;
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
