import * as React from "react";
import { observer } from "mobx-react";
import { ComponentStyleMap } from "../component-style-map";
import { dataStore } from "../data-store";
import { NullPredictionView } from "../null-prediction-view-obj";

const styles:ComponentStyleMap = {
  prediction: {
    display: "flex",
    flexDirection: "column",
    padding: "0em 2em",
    width: "20vw"
  },
  callsign: {
    fontSize: "16pt",
    fontWeight: "bold"
  },
  stationName: {
    fontSize: "10pt"
  },
  values: {
    marginTop: "1em"
  },
  temp: {
    fontSize: "12pt",
    fontWeight: "bold"
  },
  label: {
    fontSize: "9pt",
    fontStyle: "italic",
    marginTop: "1em"
  },
  rationale: {
    fontSize: "13pt"
  },
  image: {
    height: "10vh"
  }
};

export interface PredictionShareViewProps {}
export interface PredictionShareViewState {}

@observer
export class PredictionShareView extends React.Component<
  PredictionShareViewProps,
  PredictionShareViewState
> {
  interval: any;

  constructor(props: PredictionShareViewProps, ctxt: any) {
    super(props, ctxt);
  }

  render() {
    const selectedBasestation = dataStore.selectedBasestation;
    const prediction = dataStore.selectedPrediction || NullPredictionView;
    if(selectedBasestation) {
      return(
        <div style={styles.prediction}>
          <div>
            <img style={styles.image} src={selectedBasestation.imageUrl}/>
            <div style={styles.callsign}>{selectedBasestation.callsign}</div>
            <div style={styles.stationName}>{selectedBasestation.name}</div>
            <div style={styles.values}>
              <div>
                <span style={styles.label}>Predicted Temp: </span>
                <span style={styles.temp}>{prediction.temp}°</span>
              </div>
              <div style={styles.label}>Reasoning:</div>
              <div style={styles.rationale}>{prediction.rationale}</div>
            </div>
          </div>
        </div>
      );
    }
    return null;
  }

}

