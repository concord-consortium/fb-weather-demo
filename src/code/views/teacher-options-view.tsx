import * as React from "react";
import { observer } from "mobx-react";
import { CardText } from "material-ui/Card";
import Toggle from "material-ui/Toggle";
import { simulationStore } from "../stores/simulation-store";


interface SettingToggleProps {
  name: string;   // name of the setting, e.g. 'showTempValues'
  label: string;  // user label, e.g. "Show Temperature Values"
}

const SettingToggle: React.SFC<SettingToggleProps> = (props) => {

  const settings = simulationStore.settings,
        toggleStyle = { marginBottom: 16 },
        value = settings ? (settings as any)[props.name] : false;

  const handleToggle = (e: React.MouseEvent<{}>, isInputChecked: boolean) => {
    if (settings) {
      settings.setSetting(props.name, isInputChecked);
    }
  };

  return (
    <Toggle
      label={props.label}
      style={toggleStyle}
      disabled={!settings}
      onToggle={handleToggle}
      defaultToggled={value}
    />
  );
};


export type TeacherViewTab = "control" | "configure";

export interface TeacherOptionsViewProps {}
export interface TeacherOptionsViewState {}

@observer
export class TeacherOptionsView extends React.Component<
                                          TeacherOptionsViewProps,
                                          TeacherOptionsViewState > {
  constructor(props: TeacherOptionsViewProps, ctxt: any) {
    super(props, ctxt);
  }

  render() {
    const styles = {
      block: {
        maxWidth: 250
      }
    };
    return (
      <CardText>
        <div className="toggles" style={styles.block}>
          <SettingToggle name={'showBaseMap'} label={"Show Map"} />
          <SettingToggle name={'showStationNames'} label={"Show Station Names"} />
          <SettingToggle name={'showTempValues'} label={"Show Temperatures"} />
          <SettingToggle name={'showPredictions'} label={"Show Predicted Temperatures"} />
          <SettingToggle name={'showDeltaTemp'} label={"Show Predicted Differences"} />
          <SettingToggle name={'showWindValues'} label={"Show Wind Speed/Direction"} />
        </div>
      </CardText>
    );
  }
}
