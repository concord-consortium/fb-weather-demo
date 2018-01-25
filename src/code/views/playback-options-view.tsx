import * as React from "react";
import { observer } from "mobx-react";
import { CardText } from "material-ui/Card";
import TextField from "material-ui/TextField";
import { simulationStore } from "../models/simulation";

export type TeacherViewTab = "control" | "configure";

export interface PlaybackOptionsViewProps {}
export interface PlaybackOptionsViewState {}

@observer
export class PlaybackOptionsView extends React.Component<
                                          PlaybackOptionsViewProps,
                                          PlaybackOptionsViewState > {
  constructor(props: PlaybackOptionsViewProps, ctxt: any) {
    super(props, ctxt);
  }

  render() {
    const styles = {
      block: {
        maxWidth: 250
      }
    };
    const simulationControl = simulationStore.selected && simulationStore.selected.control;

    if (simulationControl) {
      const chageTimeScale = (e:any, v:string) => {
        const newScale = parseInt(v, 10);
        if (newScale && !isNaN(newScale)) {
          simulationControl.setTimeScale(newScale);
        }
      };
      const timeScale = simulationControl.timeScale;

      const changeUpdateInterval = (e:any, v:string) => {
        const newInterval = parseInt(v, 10);
        if (newInterval && !isNaN(newInterval)) {
          simulationControl.setUpdateInterval(newInterval);
        }
      };
      const updateInterval = simulationControl.updateInterval;

      return (
        <CardText>
          <div className="toggles" style={styles.block}>
            <TextField
              floatingLabelText="Time Scale"
              hintText="60"
              value={timeScale}
              onChange={chageTimeScale}
            />
            <TextField
              floatingLabelText="Simulation Update Interval (S)"
              hintText="60"
              value={updateInterval}
              onChange={changeUpdateInterval}
            />
          </div>
        </CardText>
      );
    }
    return(
      <div>
        No simulation available at this time.
      </div>
    );
  }
}
