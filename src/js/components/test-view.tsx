import * as React from "react";
import { observer } from 'mobx-react';
import { Tabs, Tab } from "material-ui/Tabs";
import RaisedButton from "material-ui/RaisedButton";
import { Card, CardActions, CardText } from "material-ui/Card";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
const _ = require("lodash");

interface routeParams {
  blarg: string
}

export interface TestViewProps {
  params: routeParams
}

export interface TestViewState {}

export class TestView extends React.Component<TestViewProps, TestViewState> {
  constructor(props:TestViewProps,ctx:any){
    super(props);
  }

  render() {
    const blarg = this.props.params.blarg
    console.log(blarg)
    return(
      <MuiThemeProvider>
        <Card>
          <div>
            Testing {blarg}
            {this.props.children}
          </div>
        </Card>
      </MuiThemeProvider>
    );
  }
}