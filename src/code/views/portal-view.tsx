import * as React from "react";
import { observer } from "mobx-react";
import { Card, CardText, CardTitle } from "material-ui/Card";
import { withRouter } from "react-router";

import { PortalUrlUtility, defaultSimulationName } from "../utilities/portal-url-utility";
import { captureSimulationMetadata } from "../models/simulation-metadata";
import { gFirebase } from "../middleware/firebase-imp";
import * as firebase from "firebase";

function windowLocationOrigin() {
  // cf. https://tosbourn.com/a-fix-for-window-location-origin-in-internet-explorer/
  return window.location.origin ||
          (window.location.protocol + "//" + window.location.hostname +
          (window.location.port ? ':' + window.location.port: ''));
}

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
    this.state = {simulationKey: defaultSimulationName, showTeacher: true};
  }

  componentDidMount() {
    const portalUrlUtility = new PortalUrlUtility();
    const showTeacher = portalUrlUtility.isTeacher;
    portalUrlUtility.getFirebaseKey().then( (key) => {
      this.setState({simulationKey:key, showTeacher: showTeacher});
      if (showTeacher) {
        const launchTime = new Date();
        captureSimulationMetadata({
          launchOrigin: windowLocationOrigin(),
          classId: portalUrlUtility.classId,
          offeringId: portalUrlUtility.offeringId,
          offeringUrl: portalUrlUtility.offeringUrl,
          activityName: portalUrlUtility.activityName,
          activityUrl: portalUrlUtility.activityUrl,
          launchTime: launchTime.toString(),
          utcLaunchTime: launchTime.toISOString()
        });
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
