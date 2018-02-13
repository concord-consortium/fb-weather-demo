import * as React from "react";
import { observer } from "mobx-react";

import { DropDownMenu, MenuItem } from "material-ui/DropDownMenu";

const TreeView = require("react-treeview");

import { PredictionType, IPrediction } from "../models/prediction";
import { ComponentStyleMap } from "../utilities/component-style-map";
import * as _ from "lodash";


export interface PredictionDisplayViewProps {}
export interface PredictionDisplayViewState {}

const styles:ComponentStyleMap = {
  predictionContainer: {
    overflowY: "auto",
    height: "264px"
  },
  predictionsTitle: {
    marginTop: 16,
    marginLeft: 20,
    fontWeight: 'bold'
  },
  prediction: {
    display: "flex",
    flexDirection: "column",
    paddingLeft: "2em",
    width: "20em"
  },
  predictionItemEven: {
    backgroundColor: "hsl(0, 0%, 95%)",
    marginTop: "1em",
    padding: "0.25em"
  },
  predictionItemOdd: {
    backgroundColor: "hsl(0, 0%, 100%)",
    marginTop: "1em",
    padding: "0.25em"
  },
  callSign: {
    fontSize: "16pt",
    fontWeight: "bold"
  },
  stationName: {
    fontSize: "10pt"
  },
  image: {
    height: "10vh"
  }
};


@observer
export class PredictionDisplayView extends React.Component<
                                  PredictionDisplayViewProps,
                                  PredictionDisplayViewState> {

  constructor(props: PredictionDisplayViewProps, ctxt: any) {
    super(props, ctxt);
    this.state = {
      tab: "control"
    };
  }

  handlePredictionTypeChange = (event: any, index: number, value: string) => {
    const settings = simulationStore.settings;
    if (settings) {
      settings.setSetting('enabledPredictions', value);
    }
  }



  render() {
    const simulation = simulationStore.selected;
    const weatherStation = simulation.selectedStation;
    if (!weatherStation) { return null; }

    const predictions = (simulation.predictions && simulation.predictions.teacherPredictions) || [],
          predictedTimes = {} as { [key: string] : { [key: string] : IPrediction[] } };

    predictions.forEach((p) => {
      const pdt = String(p.predictedTime.getTime()),
            pnt = String(p.predictionTime.getTime());
      if (predictedTimes[pdt] == null) {
        predictedTimes[pdt] = {};
      }
      const pdtSet = predictedTimes[pdt];
      if (pdtSet[pnt] == null) {
        pdtSet[pnt] = [];
      }
      pdtSet[pnt].push(p);
    });

    function formatPredictedValueLabel(prediction: IPrediction) {
      return (prediction.type === PredictionType.eDescription)
                ? "Descriptive"
                : prediction.predictedValueLabel;
    }

    function formatPredictedValue(prediction: IPrediction) {
      const d = prediction.description,
            kLimit = 17;
      return (prediction.type === PredictionType.eDescription)
                ? (d.length > kLimit
                    ? `"${prediction.description.substr(0, kLimit)}..."`
                    : d)
                : prediction.formatPredictedValue({ withUnit: true });
    }

    function renderPredictionTree(predictions: IPrediction[]) {
      return _.sortBy(predictions, 'timeStamp').reverse().map((p) => {
                const timeStamp = simulation.formatLocalTime(p.timeStamp, 'l LT'),
                      key = p.timeStamp.getTime(),
                      sLabel = formatPredictedValueLabel(p),
                      sValue = formatPredictedValue(p),
                      dLabel = p.descriptionLabel,
                      pLabel = <span className="node gray-bg">{sLabel}: {sValue}</span>;
                return (
                  <TreeView key={key} nodeLabel={pLabel} defaultCollapsed={true}>
                    <div key="description" className="info">{dLabel}: {p.description}</div>
                    <div key="time" className="info">Submitted: {timeStamp}</div>
                  </TreeView>
                );
            });
    }

    function renderPredictionTreeView() {
      return _.keys(predictedTimes).sort().reverse().map((pdt: string) => {
        const spdt = simulation.formatTime(new Date(Number(pdt)), 'l LT'),
              pdtLabel = <span className="node gray-bg">Predictions for: {spdt}</span>,
              pdtSet = predictedTimes[pdt],
              pntLabels = _.keys(pdtSet).map((pnt: string) => {
                const spnt = simulation.formatTime(new Date(Number(pnt)), 'l LT'),
                      pntLabel = <span className="node">Predicted at: {spnt}</span>,
                      predictions = pdtSet[pnt],
                      predictionTrees = renderPredictionTree(predictions);
                return (
                  <TreeView key={pnt} nodeLabel={pntLabel} defaultCollapsed={true}>
                    {predictionTrees}
                  </TreeView>
                );
              });
        return (
          <TreeView key={pdt} nodeLabel={pdtLabel} defaultCollapsed={true}>
            {pntLabels}
          </TreeView>
        );
      });
    }

    return (
      <div>
        <img style={styles.image} src={weatherStation.imageUrl}/>
        <div style={styles.callSign}>{weatherStation.callSign}</div>
        <div style={styles.stationName}>{weatherStation.name}</div>
        <div style={styles.predictionContainer}>
            <div style={styles.predictionsTitle}>Predictions</div>
            {renderPredictionTreeView()}
        </div>
      </div>
    );
  }


}
