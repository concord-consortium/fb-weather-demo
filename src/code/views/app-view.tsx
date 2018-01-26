import * as React from "react";
import { observer } from "mobx-react";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import { Link } from "react-router";
import { simulationStore } from "../models/simulation";

interface routeParams {
  blarg: string;
  sessionName: string;
}

export interface AppViewProps {
  params: routeParams;
}

export interface AppViewState {
  session: string;
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
    const simulation = simulationStore.selected,
          simulationName = simulation && simulation.name;
    return (
      <MuiThemeProvider>
        <div>
          <div style={{ display: "none", fontSize: "9pt", color: "gray" }}>
            <Link to="/simulations">
              {simulationName}
            </Link>
          </div>
          {this.props.children}
        </div>
      </MuiThemeProvider>
    );
  }
}
