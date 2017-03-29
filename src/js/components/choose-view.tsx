import * as React from "react";
import {Tabs, Tab} from "material-ui/Tabs";
import RaisedButton from "material-ui/RaisedButton";
import {Card, CardActions, CardText} from "material-ui/Card";

export interface ChooseViewProps {
  chooseTeacher(): void
  chooseStudent(): void
  chooseClassroom(): void
}

export interface ChooseViewState {}

export class ChooseView extends React.Component<ChooseViewProps, ChooseViewState> {
  constructor(props:ChooseViewProps,ctx:any){
    super(props);
  }

  render() {
    return(
      <Card>
        <Tabs>
          <Tab label="Choose view" >
            <CardText>
              Choose either student or teacher view.
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