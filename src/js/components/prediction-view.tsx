import * as React from "react";
import FlatButton from "material-ui/FlatButton";
import TextField from "material-ui/TextField";
import { observer } from "mobx-react";
import { CardText, CardActions } from "material-ui/Card";
import { ComponentStyleMap } from "../component-style-map";
import { dataStore } from "../data-store";
const _ = require("lodash");

const styles: ComponentStyleMap = {
  prediction: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    aligncontent: "center",
    width: "100%"
  },
  prompt: {
    textAlign: "center",
    fontFamily: "Helvetica",
    fontSize: "20px",
    color: "#5A5B5B",
    margin: "1em"
  },
  textField: {
    display: "block",
    margin: "1em"
  }
};

export interface PredictionViewProps {
  enabled: boolean;
  updateUserData?(): void;
}

export interface PredictionViewState {}

@observer
export class PredictionView extends React.Component<
  PredictionViewProps,
  PredictionViewState
> {
  constructor(props: PredictionViewProps, ctx: any) {
    super(props, ctx);
  }

  predictionPrompt() {
    const { enabled } = this.props;
    if (enabled) {
      return (
        <div style={styles.prompt}>
          <div>At 60 seconds the temperature is 29° degrees.</div>
          <div>
            What do you think the temperature will be 60 seconds from now?
          </div>
        </div>
      );
    }
    return (
      <div style={styles.prompt}>
        The teacher has not asked for your predictions yet.
      </div>
    );
  }

  updatePrecition(eventPoxy: any, value: string) {
    const prediction = dataStore.prediction;
    prediction.temp = parseInt(value, 10);
    dataStore.setPrediction(prediction);
  }

  updateRationale(eventPoxy: any, value: string) {
    dataStore.prediction.rationale = value;
    dataStore.setPrediction(dataStore.prediction);
  }

  render() {
    const disabled = !this.props.enabled;
    const changePrediction = this.updatePrecition.bind(this);
    const cahngeRationale = this.updateRationale.bind(this);
    return (
      <CardText style={styles.prediction}>
        {this.predictionPrompt()}
        <TextField
          style={styles.textField}
          hintText="your prediction (numeric)"
          floatingLabelText="Prediction"
          multiLine={false}
          disabled={disabled}
          onChange={changePrediction}
          value={dataStore.prediction.temp}
          type="number"
        />
        <TextField
          style={styles.textField}
          hintText="Write your reasoning here"
          floatingLabelText="Rationale"
          multiLine={true}
          onChange={cahngeRationale}
          disabled={disabled}
          value={dataStore.prediction.rationale}
          rows={4}
        />
        <CardActions>
          <FlatButton label="Share" />
        </CardActions>
      </CardText>
    );
  }
}
