import * as React from "react";
import FlatButton from "material-ui/FlatButton";
import TextField from "material-ui/TextField";
import { observer } from "mobx-react";
import { CardText, CardActions } from "material-ui/Card";
import { ComponentStyleMap } from "../utilities/component-style-map";
import { PredictionType, Prediction } from "../models/prediction";
import { simulationStore } from "../stores/simulation-store";
import * as moment from 'moment';

interface IControlLabels {
  prompt: string | null;      // null indicates skip the control entirely
  question: string | null;    // null indicates skip the control entirely
  prediction: string | null;  // null indicates skip the control entirely
  description: string | null; // null indicates skip the control entirely
}

const controlsSpec: { [id: string]: IControlLabels } = {
  description: { prompt: "Given what you see happening at %sTime%,",
                  question: "what do you think will be happening at %pTime%?",
                  prediction: null, description: "Description" },
  temperature: { prompt: "At %sTime% the temperature is %sValue%.",
                  question: "What do you think the temperature will be at %pTime%?",
                  prediction: "Predicted Temperature", description: "Rationale" },
  humidity: { prompt: "At %sTime% the humidity is %sValue%.",
              question: "What do you think the humidity will be at %pTime%?",
              prediction: "Predicted Humidity", description: "Rationale" },
  precipitation: { prompt: "At %sTime% the precipitation is %sValue%.",
                    question: "What do you think the precipitation will be at %pTime%?",
                    prediction: "Predicted Precipitation", description: "Rationale" },
  windSpeed: { prompt: "At %sTime% the wind speed is %sValue%.",
                question: "What do you think the wind speed will be at %pTime%?",
                prediction: "Predicted Wind Speed", description: "Rationale" },
  windDirection: { prompt: "At %sTime% the wind direction is %sValue%.",
                    question: "What do you think the wind direction will be at %pTime%?",
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

export interface PredictionFormViewProps {
}

export interface PredictionFormViewState {
  predictedValue: string;
  description: string;
}

@observer
export class PredictionFormView
        extends React.Component<PredictionFormViewProps, PredictionFormViewState> {
  constructor(props: PredictionFormViewProps, ctx: any) {
    super(props, ctx);

    this.state = { predictedValue: "", description: "" };
  }

  predictionPrompt() {
    const settings = simulationStore.settings,
          station = simulationStore.presenceStation,
          predictionType = settings && settings.enabledPredictions,
          predictionInterval = (settings && settings.predictionInterval) || 60;

    function getCurrentValue() {
      if (!station) { return ""; }
      switch(predictionType) {
        case PredictionType.eDescription:
          break;
        case PredictionType.eTemperature:
          return simulationStore.formatTemperature(station.temperature, { withUnit: true });
        case PredictionType.eHumidity:
          break;
        case PredictionType.ePrecipitation:
          break;
        case PredictionType.eWindSpeed:
          return simulationStore.formatWindSpeed(station.windSpeed, { withUnit: true });
        case PredictionType.eWindDirection:
          return station.strWindDirection();
      }
      return "";
    }

    if (predictionType) {
      const spec = predictionType && controlsSpec[predictionType],
            simulationTime = simulationStore.simulationTime,
            simulationTimeStr = simulationStore.timeString,
            predictionTime = simulationTime && moment(simulationTime)
                                                .add({ minutes: predictionInterval })
                                                .toDate(),
            predictionTimeStr = simulationStore.formatTime(predictionTime),
            sValue = getCurrentValue(),
            prompt = spec && spec.prompt && spec.prompt
                      .replace(/%sTime%/, simulationTimeStr)
                      .replace(/%sValue%/, sValue),
            question = spec && spec.question && spec.question
                        .replace(/%pTime%/, predictionTimeStr);
      return (
        <div style={styles.prompt}>
          <div>{prompt}</div>
          <div>{question}</div>
        </div>
      );
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
    const predictionType = simulationStore.settings && simulationStore.settings.enabledPredictions,
          simulationTime = simulationStore.simulationTime,
          predictions = simulationStore.predictions;

    if (!predictionType || !simulationTime || !predictions) { return; }

    function parsePredictedValue(strValue: string) {
      switch(predictionType) {
        case PredictionType.eDescription:
          break;
        case PredictionType.eTemperature:
          return simulationStore.parseTemperature(strValue);
        case PredictionType.eHumidity:
          break;
        case PredictionType.ePrecipitation:
          break;
        case PredictionType.eWindSpeed:
          return simulationStore.parseWindSpeed(strValue);
        case PredictionType.eWindDirection:
          return simulationStore.parseWindDirection(strValue);
      }
      return null;
    }
                          // default to 1 hour from current simulation time
    const predictedTime = moment(simulationTime).add({ hours: 1 }).toDate(),
          prediction = Prediction.create({
                          type: predictionType,
                          predictionTime: simulationTime,
                          predictedTime: predictedTime,
                          predictedValue: parsePredictedValue(this.state.predictedValue),
                          description: this.state.description
                        });
    predictions.addPrediction(prediction);
  }

  render() {
    const settings = simulationStore.settings,
          enabledPredictions = settings && settings.enabledPredictions,
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
          descriptionPrompt = isEnabled && cSpec ? cSpec.description : "";
    return (
      <CardText style={styles.prediction}>
        {this.predictionPrompt()}
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
