import * as React from "react";
import FlatButton from "material-ui/FlatButton";
import TextField from "material-ui/TextField";
import { observer } from "mobx-react";
import { CardText, CardActions } from "material-ui/Card";
import { ComponentStyleMap } from "../component-style-map";
import { PredictionType, Prediction, IPrediction } from "../models/prediction";

import { simulationStore } from "../stores/simulation-store";


const _ = require("lodash");

interface IControlLabels {
  question: string | null;     // null indicates skip the control entirely
  prediction: string | null;   // null indicates skip the control entirely
  description: string | null;  // null indicates skip the control entirely
}

const controlsSpec: { [id: string]: IControlLabels } = {
  description: { question: "What do you think will happen in the next hour?",
                  prediction: null, description: "Description" },
  temperature: { question: "What do you think the temperature will be in 60 minutes?",
                  prediction: "Predicted Temperature", description: "Rationale" },
  humidity: { question: "What do you think the humidity will be in 60 minutes?",
                prediction: "Predicted Humidity", description: "Rationale" },
  precipitation: { question: "What do you think the precipitation will be in 60 minutes?",
                    prediction: "Predicted Precipitation", description: "Rationale" },
  windSpeed: { question: "What do you think the wind speed will be in 60 minutes?",
                prediction: "Predicted Wind Speed", description: "Rationale" },
  windDirection: { question: "What do you think the wind direction will be in 60 minutes?",
                    prediction: "Predicted Wind Direction", description: "Rationale" }
};

const styles: ComponentStyleMap = {
  prediction: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignContent: "center",
    width: "100%"
  },
  prompt: {
    textAlign: "center",
    fontFamily: "Helvetica",
    fontSize: "20px",
    color: "#5A5B5B",
    margin: "1em"
  },
  typeMenu: {
    width: 250
  },
  textField: {
    display: "block",
    margin: "1em"
  }
};

export interface PredictionViewProps {
}

export interface PredictionViewState {
  predictedValue: string;
  description: string;
}

@observer
export class PredictionView
        extends React.Component<PredictionViewProps, PredictionViewState> {
  constructor(props: PredictionViewProps, ctx: any) {
    super(props, ctx);

    this.state = { predictedValue: "", description: "" };
  }

  predictionPrompt(type: string | null, simTime: Date, value?: number) {
    if(simulationStore.settings && simulationStore.settings.showPredictions) {
      const spec = type && controlsSpec[type],
            timeStr = simulationStore.timeString,
            prompt = "At time %1 the temperature is %2 degrees."
                      .replace(/%1/, timeStr)
                      .replace(/%2/, value != null ? String(value) : ""),
            question = (spec && spec.question) || "";
      return (
        <div style={styles.prompt}>
          <div>{prompt}</div>
          <div>{question}</div>
        </div>);
    }
    return (
      <div style={styles.prompt}>
        Predictions have not been requested at this time.
      </div>
    );
  }

  handlePredictionChange = (event: any, value: string) => {
    this.setState({ predictedValue: value });
  }

  handleDescriptionChange = (event: any, value: string) => {
    this.setState({ description: value });
  }

  submitPrediction = (event: any) => {
    const type = simulationStore.settings.showPredictions,
          time = new Date(),
          simulationTime = simulationStore.simulationTime,
          predictedTime = simulationTime + 3,
          prediction = Prediction.create({
                          type: type,
                          timeStamp: time,
                          predictionTime: simulationTime,
                          predictedTime: predictedTime,
                          predictedValue: type !== PredictionType.eDescription
                                            ? this.state.predictedValue : null,
                          description: this.state.description
                        });
    simulationStore.predictions.addPrediction(prediction);
  }

  render() {
    const settings = simulationStore.settings;

    const enabledPredictions = settings && settings.enabledPredictions,
          isEnabled = enabledPredictions != null,
          isNumericPrediction = isEnabled && (enabledPredictions !== PredictionType.eDescription),
          cSpec = controlsSpec[enabledPredictions || ''],
          valueControl = <TextField
                            style={styles.textField}
                            hintText="your prediction (numeric)"
                            floatingLabelText={cSpec && cSpec.prediction}
                            multiLine={false}
                            disabled={!isEnabled}
                            onChange={this.handlePredictionChange}
                            value={this.state.predictedValue}
                            type="number"
                          />,
          optValueControl = isNumericPrediction ? valueControl : null,
          descriptionPrompt = isEnabled && cSpec ? cSpec.description : "",
          simulationTime = simulationStore.simulationTime;
    return (
      <CardText style={styles.prediction}>
        {this.predictionPrompt(enabledPredictions, simulationTime, 6)}
        {optValueControl}
        <TextField
          style={styles.textField}
          hintText="Write your reasoning here"
          floatingLabelText={descriptionPrompt}
          multiLine={true}
          onChange={this.handleDescriptionChange}
          disabled={!isEnabled}
          value={this.state.description}
          rows={4}
        />
        <CardActions>
          <FlatButton label="Submit" disabled={!isEnabled} onTouchTap={this.submitPrediction} />
        </CardActions>
      </CardText>
    );
  }
}
