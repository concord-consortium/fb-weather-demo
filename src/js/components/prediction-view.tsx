import * as React from "react";
import DropDownMenu from 'material-ui/DropDownMenu';
import FlatButton from "material-ui/FlatButton";
import MenuItem from 'material-ui/MenuItem';
import TextField from "material-ui/TextField";
import { observer } from "mobx-react";
import { CardText, CardActions } from "material-ui/Card";
import { ComponentStyleMap } from "../component-style-map";
import { dataStore, Prediction } from "../data-store";
const _ = require("lodash");

enum PredictionType {
  eDescription,
  eTemperature,
  ePrecipitation,
  eWindSpeed,
  eWindDirection
}

interface INewPrediction {
  station?: string;
  type: PredictionType;
  timeStamp?: Date;
  predictionTime?: number;
  predictedTime?: number;
  predictedValue?: number;
  description?: string;
  imageUrl?: string;
}

interface IControlLabels {
  question: string | null;     // null indicates skip the control entirely
  prediction: string | null;   // null indicates skip the control entirely
  description: string | null;  // null indicates skip the control entirely
}

const controlsSpec: { [id: number]: IControlLabels } = {
  0: { question: "What do you think will happen in the next hour?",
        prediction: null, description: "Description" },
  1: { question: "What do you think the temperature will be in 60 minutes?",
        prediction: "Predicted Temperature", description: "Rationale" },
  2: { question: "What do you think the precipitation will be in 60 minutes?",
        prediction: "Predicted Precipitation", description: "Rationale" },
  3: { question: "What do you think the wind speed will be in 60 minutes?",
        prediction: "Predicted Wind Speed", description: "Rationale" },
  4: { question: "What do you think the wind direction will be in 60 minutes?",
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
  enabled: boolean;
  updateUserData?(): void;
}

export interface PredictionViewState {
  dataStorePrediction: Prediction;
  prediction: INewPrediction;
}

@observer
export class PredictionView
        extends React.Component<PredictionViewProps, PredictionViewState> {
  constructor(props: PredictionViewProps, ctx: any) {
    super(props, ctx);
  }

  updatePredictionFromDataStore() {
    if (_.isEqual(this.state && this.state.dataStorePrediction, dataStore.prediction)) {
      return;
    }

    const userInfo = dataStore.userInfo,
          prediction = dataStore.prediction,
          predictionInterval = 3;  // ~20 min/frame
    let newPrediction : INewPrediction = {
          station: userInfo.basestationId,
          type: PredictionType.eTemperature,  // default to temperature prediction
          timeStamp: new Date(),
          predictionTime: dataStore.frameNumber,
          predictedTime: dataStore.frameNumber + predictionInterval,
          predictedValue: prediction.temp,
          description: prediction.rationale
        };
    this.setState({ dataStorePrediction: _.clone(prediction), prediction: newPrediction });
  }

  componentWillMount() {
    this.updatePredictionFromDataStore();
  }

  componentWillReceiveProps(nextProps: any) {
    this.updatePredictionFromDataStore();
  }

  predictionPrompt(type: PredictionType, simTime: number, value?: number) {
    const { enabled } = this.props;
    if (enabled) {
      const spec = controlsSpec[type],
            timeStr = dataStore.timeString,
            prompt = "At time %1 the temperature is %2 degrees."
                      .replace(/%1/, timeStr)
                      .replace(/%2/, value != null ? String(value) : ""),
            question = (spec && controlsSpec[type].question) || "";
      return (
        <div style={styles.prompt}>
          <div>{prompt}</div>
          <div>{question}</div>
        </div>
      );
    }
    return (
      <div style={styles.prompt}>
        The teacher has not asked for your predictions yet.
      </div>
    );
  }

  handleTypeChange = (event: any, index: number, value: number) => {
    const prediction = this.state.prediction;
    prediction.type = value;
    this.setState({ prediction });
  }

  handlePredictionChange = (event: any, value: string) => {
    const predictedValue = parseFloat(value);
    let prediction = dataStore.prediction,
        newPrediction = this.state.prediction;
    prediction.temp = predictedValue;
    dataStore.setPrediction(prediction);
    newPrediction.predictedValue = predictedValue;
    this.setState({ prediction: newPrediction });
  }

  handleDescriptionChange = (event: any, value: string) => {
    let prediction = dataStore.prediction,
        newPrediction = this.state.prediction;
    prediction.rationale = value;
    dataStore.setPrediction(prediction);
    newPrediction.description = value;
    this.setState({ prediction: newPrediction });
  }

  render() {
    const disabled = !this.props.enabled,
          prediction = this.state.prediction,
          controlSpecs = controlsSpec[prediction.type],
          valueControl = <TextField
                            style={styles.textField}
                            hintText="your prediction (numeric)"
                            floatingLabelText={controlsSpec[prediction.type].prediction}
                            multiLine={false}
                            disabled={disabled}
                            onChange={this.handlePredictionChange}
                            value={prediction.predictedValue}
                            type="number"
                          />,
          optValueControl = prediction.type !== PredictionType.eDescription
                              ? valueControl : null;
    return (
      <CardText style={styles.prediction}>
        {this.predictionPrompt(prediction.type, dataStore.frameNumber, prediction.predictedValue)}
        <DropDownMenu
          style={styles.typeMenu}
          value={prediction.type}
          autoWidth={true}
          onChange={this.handleTypeChange}>
          <MenuItem value={PredictionType.eTemperature} primaryText="Temperature Prediction" />
          <MenuItem value={PredictionType.eDescription} primaryText="Descriptive Prediction" />
        </DropDownMenu>
        {optValueControl}
        <TextField
          style={styles.textField}
          hintText="Write your reasoning here"
          floatingLabelText={controlsSpec[prediction.type].description}
          multiLine={true}
          onChange={this.handleDescriptionChange}
          disabled={disabled}
          value={prediction.description}
          rows={4}
        />
        <CardActions>
          <FlatButton label="Share" />
        </CardActions>
      </CardText>
    );
  }
}
