import * as React from "react";
import { observer } from "mobx-react";
import { Card, CardText, CardTitle } from "material-ui/Card";
import MenuItem from "material-ui/MenuItem";
import SelectField from "material-ui/SelectField";
import Toggle from "material-ui/Toggle";
import { MapConfig } from "../map-config";
import { dataStore } from "../data-store";

export type TeacherViewTab = "control" | "configure";

export interface TeacherOptionsViewProps {}
export interface TeacherOptionsViewState {}

@observer
export class TeacherOptionsView extends React.Component<
  TeacherOptionsViewProps,
  TeacherOptionsViewState
> {
  interval: any;
  constructor(props: TeacherOptionsViewProps, ctxt: any) {
    super(props, ctxt);
  }

  setMap(e: any, indexs: number, id: string) {
    dataStore.mapConfig = dataStore.mapConfigMap[id];
  }

  renderPrefButton(label: string, key: string) {
    const toggleStyle = {
      marginBottom: 16
    };

    const prefFactory = function(key: string) {
      const returnF = function(e: any, v: any) {
        dataStore.setPref(key, v);
      };
      return returnF.bind(this);
    }.bind(this);

    return (
      <Toggle
        label={label}
        style={toggleStyle}
        onToggle={prefFactory(key)}
        defaultToggled={(dataStore.prefs as any)[key]} // TODO?
      />
    );
  }

  render() {
    const setMap = this.setMap.bind(this);
    const gridNames = ["default", "classGrid"];
    const gridName = /* dataStore.prefs.gridName || */ "default";
    const mapId = dataStore.mapConfig ? dataStore.mapConfig.id : 0;
    const styles = {
      block: {
        maxWidth: 250
      }
    };
    return (
      <CardText>
        <SelectField
          floatingLabelText="Use this map:"
          value={mapId}
          autoWidth={true}
          onChange={setMap}
        >
          {dataStore.mapConfigs.map((map: MapConfig) =>
            <MenuItem key={map.id} value={map.id} primaryText={map.name} />
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
