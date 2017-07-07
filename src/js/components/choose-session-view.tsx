import * as React from "react";
import { observer } from 'mobx-react';
import { Tabs, Tab } from "material-ui/Tabs";
import RaisedButton from "material-ui/RaisedButton";
import { Card, CardActions, CardText } from "material-ui/Card";
import { Link } from 'react-router'
const _ = require("lodash");

interface routeParams {
  sessionName: string
}

export interface ChooseViewProps {
  params: routeParams
}

export interface ChooseViewState {}


@observer
export class ChooseView extends React.Component<ChooseViewProps, ChooseViewState> {
  constructor(props:ChooseViewProps,ctx:any){
    super(props);
  }

  linkTo(relativePath:string) {
    const session = this.props.params.sessionName
    // const path = "x"
    const pathString:string = `/sessions/${session}/${relativePath}`
    return <Link to={ pathString} />
  }

  render() {
    return(
      <Card>
        <Tabs>
          <Tab label="Choose view" >
            <CardActions>
              <RaisedButton primary={true} containerElement={this.linkTo("show/student")}>
                Student
              </RaisedButton>
              <RaisedButton containerElement={this.linkTo("show/teacher")}>
                Teacher
              </RaisedButton>
              <RaisedButton containerElement={this.linkTo("show/class")}>
                ClassRoom
              </RaisedButton>
              <RaisedButton containerElement={this.linkTo("show/<setup></setup>")}>
                Setup
              </RaisedButton>
            </CardActions>
          </Tab>
        </Tabs>
      </Card>
    );
  }
}