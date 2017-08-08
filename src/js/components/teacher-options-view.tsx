import * as React from "react";
import { observer } from "mobx-react";
import { Card, CardText, CardTitle } from "material-ui/Card";
import MenuItem from "material-ui/MenuItem";
import SelectField from "material-ui/SelectField";
import Toggle from "material-ui/Toggle";
import { ISimulation } from "../models/simulation";
import { simulationStore } from "../stores/simulation-store";

export type TeacherViewTab = "control" | "configure";

export interface TeacherOptionsViewProps {}
export interface TeacherOptionsViewState {}

const _ = require("lodash");

@observer
export class TeacherOptionsView extends React.Component<
  TeacherOptionsViewProps,
  TeacherOptionsViewState
> {
  interval: any;
  constructor(props: TeacherOptionsViewProps, ctxt: any) {
    super(props, ctxt);
  }

  setScenario(e: any, indexs: number, id: string) {
    simulationStore.selectById(id);
  }

  renderPrefButton(label: string, key: string) {
    const toggleStyle = {
      marginBottom: 16
    };

    const prefFactory = function(key: string) {
      const returnF = function(e: any, v: any) {
        simulationStore.settings.setPref(key, v);
      };
      return returnF.bind(this);
    }.bind(this);

    return (
      <Toggle
        label={label}
        style={toggleStyle}
        onToggle={prefFactory(key)}
        defaultToggled={(simulationStore.settings as any)[key]} // TODO?
      />
    );
  }

  render() {
    const setMap = this.setScenario.bind(this);
    const gridNames = ["default", "classGrid"];
    const gridName = /* dataStore.prefs.gridName || */ "default";
    const simulationId = simulationStore.selected ? simulationStore.selected : 0;
    const styles = {
      block: {
        maxWidth: 250
      }
    };
    return (
      <CardText>
        <SelectField
          floatingLabelText="Use this map:"
          value={simulationId}
          autoWidth={true}
          onChange={setMap}
        >
          {_.map(simulationStore.simulations, (simulation: ISimulation) =>
              <MenuItem key={simulation.id} value={simulation.id} primaryText={simulation.name} />
          )}
        </SelectField>
        <div className="toggles" style={styles.block}>
          {this.renderPrefButton("Show Map", "showBaseMap")}
          {this.renderPrefButton("Show Names", "showStationNames")}
          {this.renderPrefButton("Show Temperature", "showTempValues")}
          {this.renderPrefButton("Show Predictions", "showPredictions")}
          {this.renderPrefButton("Show Prediction Diff", "showDeltaTemp")}
          {this.renderPrefButton("Enable prediction", "enablePrediction")}
        </div>
      </CardText>
    );
  }
}
