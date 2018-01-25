import * as React from "react";
import { observer } from "mobx-react";
import { Card, CardText, CardTitle } from "material-ui/Card";
import { withRouter } from "react-router";

import { PortalUrlUtility, kDefaultSimulationName } from "../utilities/portal-url-utility";
import { gFirebase } from "../middleware/firebase-imp";
import * as firebase from "firebase";

export interface PortalViewProps {
  router: any;
}

export interface PortalViewState {
  simulationKey: string;
  showTeacher: boolean;
}

@observer
class _PortalView extends React.Component<
  PortalViewProps,
  PortalViewState
> {
  constructor(props: PortalViewProps, ctx: any) {
    super(props);
    // default to teacher
    this.state = {simulationKey: kDefaultSimulationName, showTeacher: true};
  }

  componentDidMount() {
    const portalUrlUtility = new PortalUrlUtility();
    const showTeacher = portalUrlUtility.isTeacher;
    portalUrlUtility.getFirebaseKey().then( (key) => {
      this.setState({simulationKey:key, showTeacher: showTeacher});
      if (showTeacher) {
        // advance to teacher view
        this.props.router.push(this.nextUrl(key));
      }
      else {
        // students must wait until teacher has started simulation
        gFirebase.refForPath(`simulations/${key}`)
          .then((ref:firebase.database.Reference) => {
            const handleSnapshot = (snapshot: firebase.database.DataSnapshot | null) => {
              if (snapshot && snapshot.val()) {
                // remove handler once simulation exists
                ref.off('value', handleSnapshot);
                // advance to student/weather station view
                this.props.router.push(this.nextUrl(key));
              }
            };
            // attach handler for detecting simulation existence
            ref.on('value', handleSnapshot);
          });
      }
    });
  }

  nextUrl(key: string) {
    const view = this.state.showTeacher ? "teacher" : "student";
    return `/simulations/${key}/show/${view}`;
  }

  render() {
    return (
      <Card>
        <CardTitle>Start Simulation</CardTitle>
        <CardText style={{}}>
          Waiting for simulation to begin...
        </CardText>
      </Card>
    );
  }
}
export const PortalView = withRouter(_PortalView);
