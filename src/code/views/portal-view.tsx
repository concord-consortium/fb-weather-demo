import * as React from "react";
import { observer } from "mobx-react";
import { Card, CardText, CardTitle } from "material-ui/Card";
import { withRouter } from "react-router";

import { gPortalUrlUtility, defaultSimulationName } from "../utilities/portal-url-utility";
import { captureSimulationMetadata } from "../models/simulation-metadata";
import { gFirebase } from "../middleware/firebase-imp";
import { removeUrlParams } from "../utilities/url-params";

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
  startTitle: string;
  startMessage: string;
  startDetail?: string;
  startSuggestion?: string;
}

@observer
class _PortalView extends React.Component<
  PortalViewProps,
  PortalViewState
> {
  constructor(props: PortalViewProps, ctx: any) {
    super(props);
    // default to teacher
    this.state = {
      simulationKey: defaultSimulationName,
      showTeacher: true,
      startTitle: "Start Simulation",
      startMessage: "Waiting for simulation to begin..."
    };
  }

  updateUrlParams() {
    const orgParams = window.location.search,
          newParams = removeUrlParams(['token', 'domain', 'domain_uid']);
    if (orgParams && (orgParams !== newParams)) {
      const newUrl = window.location.href.replace(orgParams, newParams);
      history.replaceState(null, "", newUrl);
    }
  }

  componentDidMount() {
    const showTeacher = gPortalUrlUtility.isTeacher;
    gPortalUrlUtility.getFirebaseSettings(gFirebase.portalAppName).then( ({key, jwt}) => {
      this.setState({simulationKey:key, showTeacher: showTeacher});

      // remove transient url params so they don't affect page reload
      this.updateUrlParams();

      // extract additional user/presence information
      if (showTeacher) {
        const launchTime = new Date();
        captureSimulationMetadata({
          launchOrigin: windowLocationOrigin(),
          classId: gPortalUrlUtility.classId,
          offeringId: gPortalUrlUtility.offeringId,
          offeringUrl: gPortalUrlUtility.offeringUrl,
          activityName: gPortalUrlUtility.activityName,
          activityUrl: gPortalUrlUtility.activityUrl,
          launchTime: launchTime.toString(),
          utcLaunchTime: launchTime.toISOString()
        });
        // advance to teacher view
        this.props.router.push(this.nextUrl(key));
      }
      else {
        // TODO: should be able to eliminate this wait, since there's already
        // a wait in place at the StudentTabsView, but when we proceed from here
        // the simulation gets created before we get there.
        // students must wait until teacher has started simulation
        gFirebase.waitForPathToExist(`simulations/${key}`, (snapshot: any) => {
          // advance to student/weather station view
          this.props.router.push(this.nextUrl(key));
        });
      }
    })
    .catch((error) => {
      this.setState({
        startTitle: "Error",
        startMessage: `Could not start the simulation because an error occurred.`,
        startDetail: `[${error.message}]`,
        startSuggestion: "Try relaunching the simulation from the portal."
      });
    });
  }

  nextUrl(key: string) {
    const view = this.state.showTeacher ? "teacher" : "student";
    return `/simulations/${key.replace('/', '-')}/show/${view}`;
  }

  render() {
    const { startTitle, startMessage, startDetail, startSuggestion } = this.state,
          detail = startDetail ? <div>{startDetail}</div> : null,
          spacer = startSuggestion ? <div>{"\u00A0"}</div> : null,
          suggestion = startSuggestion ? <div>{startSuggestion}</div> : null;
    return (
      <Card>
        <CardTitle>{startTitle}</CardTitle>
        <CardText style={{}}>
          {startMessage}
          {detail}
          {spacer}
          {spacer}
          {suggestion}
        </CardText>
      </Card>
    );
  }
}
export const PortalView = withRouter(_PortalView);
