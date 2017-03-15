import React, {PropTypes} from "react";

import RaisedButton from "material-ui/RaisedButton";
import {Card, CardActions, CardHeader} from "material-ui/Card";

export default class ChooseView extends React.Component {

  static propTypes = {
    chooseTeacher: PropTypes.function,
    chooseStudent: PropTypes.function
  }

  constructor(props){
    super(props);
  }

  render() {
    return(
      <Card>
        <CardHeader
          title="Choose View"
          subtitle="select either student or teacher view:"
          actAsExpander={true}
          showExpandableButton={true}
        />

        <CardActions>
          <RaisedButton
            secondary={true}
            onTouchTap={this.props.chooseStudent}
          >
          Student
          </RaisedButton>

          <RaisedButton
            secondary={false}
            onTouchTap={this.props.chooseTeacher}
          >
          Teacher
          </RaisedButton>
        </CardActions>

      </Card>
    );
  }
}