import * as React from "react";
import { observer } from "mobx-react";
import RaisedButton from "material-ui/RaisedButton";
import { Card, CardActions } from "material-ui/Card";
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
    this.state = {simulationKey: 'fake', showTeacher: true}
  }

  componentDidMount() {
    const portalUrlUtility = new PortalUrlUtility();
    const showTeacher = portalUrlUtility.isTeacher;
    portalUrlUtility.getFirebaseKey().then( (key) => {
      this.setState({simulationKey:key, showTeacher: showTeacher});
    });
  }

  linkToSim() {
    const simulation = this.state.simulationKey;
    const view = this.state.showTeacher ? "teacher" : "student";
    const studentPath = `/simulations/${simulation}/show/${view}`;
    return <Link to={studentPath} />;
  }

  render() {
    const location = window.location;
    console.log(location);
    return (
      <Card>
        <div style={{}}>
          Hi This here is an unstyled view.
        </div>
        <CardActions>
          <RaisedButton
            primary={true}
            containerElement={this.linkToSim()}
          >
          Link
          </RaisedButton>
        </CardActions>
      </Card>
    );
  }
}
