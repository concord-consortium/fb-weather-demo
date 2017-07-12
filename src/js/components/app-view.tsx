import * as React from "react";
import { observer } from "mobx-react";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import DevTools from "mobx-react-devtools";
import { Presence } from "../presence";
import { dataStore } from "../data-store";
import { Link } from "react-router";

interface routeParams {
  blarg: string;
  sessionName: string;
}

export interface AppViewProps {
  params: routeParams;
}
export interface AppViewState {
  session: string;
  presence?: Presence;
}

@observer
export class AppView extends React.Component<AppViewProps, AppViewState> {
  public state: AppViewState;
  constructor(props: AppViewProps) {
    super(props);
    this.state = {
      session: "default"
    };
  }

  render() {
    return (
      <MuiThemeProvider>
        <div>
          <div style={{ fontSize: "9pt", color: "gray" }}>
            <Link to="/sessions">
              {dataStore.sessionPath}
            </Link>
          </div>
          {/*<DevTools />*/}
          {this.props.children}
        </div>
      </MuiThemeProvider>
    );
  }
}
