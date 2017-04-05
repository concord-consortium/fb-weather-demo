import * as React from "react";
import {observer} from 'mobx-react';
import {Tabs, Tab} from "material-ui/Tabs";
import RaisedButton from "material-ui/RaisedButton";
import {Card, CardActions, CardText} from "material-ui/Card";
import { dataStore } from "../data-store";
import * as _ from "lodash";

export interface ChooseViewProps {
  chooseTeacher(): void
  chooseStudent(): void
  chooseClassroom(): void
}

export interface ChooseViewState {}

@observer
export class ChooseView extends React.Component<ChooseViewProps, ChooseViewState> {
  constructor(props:ChooseViewProps,ctx:any){
    super(props);
  }

  render() {
    const predictions = _.map(dataStore.predictions, (prediction) =>
        <div style={{padding: "1em"}}>
          <div>{prediction.precictedTemp}</div>
          <div>{prediction.rationale}</div>
        </div>
    );
    const baseStation = dataStore.presence
    return(
      <Card>
        <Tabs>
          <Tab label="Choose view" >
            <CardText>
              {predictions}
            </CardText>

            <CardActions>
              <RaisedButton primary={true} onTouchTap={this.props.chooseStudent}>
                Student
              </RaisedButton>

              <RaisedButton onTouchTap={this.props.chooseTeacher}>
                Teacher
              </RaisedButton>
              <RaisedButton onTouchTap={this.props.chooseClassroom}>
                ClassRoom
              </RaisedButton>
            </CardActions>
          </Tab>
        </Tabs>
      </Card>
    );
  }
}