import * as React from "react";
import {observer} from 'mobx-react';
import {Tabs, Tab} from "material-ui/Tabs";
import RaisedButton from "material-ui/RaisedButton";
import {Card, CardActions, CardText} from "material-ui/Card";

import { router } from "../router";
const _ = require("lodash");

export interface ChooseViewProps {
}

export interface ChooseViewState {}

@observer
export class ChooseView extends React.Component<ChooseViewProps, ChooseViewState> {
  constructor(props:ChooseViewProps,ctx:any){
    super(props);
  }

  render() {
    return(
      <Card>
        <Tabs>
          <Tab label="Choose view" >

            <CardActions>
              <RaisedButton primary={true} onTouchTap={router.showStudent.bind(router)}>
                Student
              </RaisedButton>
              <RaisedButton onTouchTap={router.showTeacher.bind(router)}>
                Teacher
              </RaisedButton>
              <RaisedButton onTouchTap={router.showClassroom.bind(router)}>
                ClassRoom
              </RaisedButton>
              <RaisedButton onTouchTap={router.showSetup.bind(router)}>
                Setup
              </RaisedButton>
            </CardActions>
          </Tab>
        </Tabs>
      </Card>
    );
  }
}