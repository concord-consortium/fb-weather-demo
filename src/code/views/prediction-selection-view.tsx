import * as React from "react";
import { observer } from "mobx-react";

import { DropDownMenu, MenuItem } from "material-ui/DropDownMenu";
import { PredictionType, IPrediction } from "../models/prediction";
import { simulationStore } from "../stores/simulation-store";

import * as _ from "lodash";


export interface PredictionSelectionViewProps {}
export interface PredictionSelectionViewState {}


@observer
export class PredictionSelectionView extends React.Component<
                                  PredictionSelectionViewProps,
                                  PredictionSelectionViewState> {

  constructor(props: PredictionSelectionViewProps, ctxt: any) {
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
    const time = simulationStore.timeString;


    const enabledPredictions = simulationStore.settings && simulationStore.settings.enabledPredictions,
      menuOptions = [
        <MenuItem key={0} value={null} primaryText="Disable Predictions" />,
        <MenuItem key={1} value={PredictionType.eDescription} primaryText="Enable Descriptive Predictions" />,
        <MenuItem key={2} value={PredictionType.eTemperature} primaryText="Enable Temperature Predictions" />,
        <MenuItem key={3} value={PredictionType.eWindSpeed} primaryText="Enable Wind Speed Predictions" />,
        <MenuItem key={4} value={PredictionType.eWindDirection} primaryText="Enable Wind Direction Predictions" />
      ].filter((item) => {
        const settings = simulationStore.settings,
              showTempValues = settings && settings.showTempValues,
              showWindValues = settings && settings.showWindValues;
        if (!showTempValues && (item.props.value === PredictionType.eTemperature)) {
          return false;
        }
        if (!showWindValues && ((item.props.value === PredictionType.eWindSpeed) ||
                                item.props.value === PredictionType.eWindDirection)) {
          return false;
        }
        return true;
      });

    return (
        <DropDownMenu
          style={{}}
          value={enabledPredictions}
          autoWidth={true}
          onChange={this.handlePredictionTypeChange}>
          {menuOptions}
        </DropDownMenu>
    );
  }
}
