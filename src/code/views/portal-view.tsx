import * as React from "react";
import { observer } from "mobx-react";
import RaisedButton from "material-ui/RaisedButton";
import { Card, CardActions, CardText, CardTitle } from "material-ui/Card";
import { Link } from "react-router";

import { PortalUrlUtility  } from "../utilities/portal-url-utility";

export interface PortalViewProps { }

export interface PortalViewState {
  simulationKey: string;
  showTeacher: boolean;
}

@observer
export class PortalView extends React.Component<
  PortalViewProps,
  PortalViewState
> {
  constructor(props: PortalViewProps, ctx: any) {
    super(props);
    this.state = {simulationKey: 'fake', showTeacher: true};
  }

  componentDidMount() {
    const portalUrlUtility = new PortalUrlUtility();
    const showTeacher = portalUrlUtility.isTeacher;
    portalUrlUtility.getFirebaseKey().then( (key) => {
      this.setState({simulationKey:key, showTeacher: showTeacher});
    });
  }

  nextUrl() {
    const simulation = this.state.simulationKey;
    const view = this.state.showTeacher ? "teacher" : "student";
    return `/simulations/${simulation}/show/${view}`;
  }

  linkToSim() {
    return <Link to={this.nextUrl()} />;
  }

  render() {
    return (
      <Card>
        <CardTitle>Start Simulation</CardTitle>
        <CardText style={{}}>
          When the class is ready press the "Start" button below.
        </CardText>
        <CardActions>
          <RaisedButton
            primary={true}
            containerElement={this.linkToSim()}
          >
          Start
          </RaisedButton>
        </CardActions>
      </Card>
    );
  }
}
