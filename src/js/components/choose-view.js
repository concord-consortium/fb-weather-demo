import React, {PropTypes} from "react";
import {Tabs, Tab} from 'material-ui/Tabs';

import RaisedButton from "material-ui/RaisedButton";
import {Card, CardActions, CardHeader, CardText} from "material-ui/Card";
import ClassView from "./class-view";

export default class ChooseView extends React.Component {

  static propTypes = {
    chooseTeacher: PropTypes.function,
    chooseStudent: PropTypes.function,
    chooseClassroom: PropTypes.function,
  }

  constructor(props){
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
              <RaisedButton primary="true" onTouchTap={this.props.chooseStudent}>
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