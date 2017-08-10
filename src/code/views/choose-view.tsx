import * as React from "react";
import { observer } from "mobx-react";
import { Tabs, Tab } from "material-ui/Tabs";
import RaisedButton from "material-ui/RaisedButton";
import { Card, CardActions } from "material-ui/Card";
import { Link } from "react-router";

interface routeParams {
  simulationName: string;
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
    const simulationName = this.props.params.simulationName;
    const pathString: string = `/simulations/${simulationName}/${relativePath}`;
    return <Link to={pathString} />;
  }

  render() {
    return (
      <Card>
        <Tabs>
          <Tab label="Choose view">
            <CardActions>
              <RaisedButton
                primary={true}
                containerElement={this.linkTo("show/student")}
              >
                Student
              </RaisedButton>
              <RaisedButton containerElement={this.linkTo("show/teacher")}>
                Teacher
              </RaisedButton>
              <RaisedButton containerElement={this.linkTo("show/classroom")}>
                ClassRoom
              </RaisedButton>
              {/*}
              <RaisedButton containerElement={this.linkTo("show/setup")}>
                Setup
              </RaisedButton>
              */}
            </CardActions>
          </Tab>
        </Tabs>
      </Card>
    );
  }
}
