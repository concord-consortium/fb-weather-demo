import * as React from "react";
import { observer } from "mobx-react";
import RaisedButton from "material-ui/RaisedButton";
import Slider from 'material-ui/Slider';

import { simulationStore } from "../stores/simulation-store";

export interface SegmentedControlViewProps {}
export interface SegmentedControlViewState {
  splitTime?: number|null;
}

@observer
export class SegmentedControlView extends React.Component<
                                  SegmentedControlViewProps,
                                  SegmentedControlViewState> {

  render() {
    const isPlaying = !!(simulationStore.selected && simulationStore.selected.isPlaying);
    // const playPauseIcon = isPlaying ? "icon-pause_circle_filled" : "icon-play_circle_filled";
    // const playPauseAction = isPlaying ? simulationStore.stop : simulationStore.play;
    const playFirstHalf = () =>  simulationStore.playFirstHalf();
    const playSecondHalf = () => simulationStore.playSecondHalf();
    const reset = () => simulationStore.rewind();
    const dragStop = (o:any) => {
      if (simulationStore.selected) {
        const newTime = this.state.splitTime;
        if(newTime) {
          simulationStore.selected.setProportionalTime(newTime);
          simulationStore.selected.setHalfTime();
        }
      }
    };

    const change   = (o:any, v:number) => this.setState ( {splitTime: v });

    return(
      <div style={{maxWidth: "500px", marginLeft: "2em"}} >
        <div>
            <RaisedButton
              disabled={isPlaying}
              onTouchTap={reset}
              label="Reset"
              primary={true}
            />
            <RaisedButton
              disabled={isPlaying}
              onTouchTap={playFirstHalf}
              label="Run first portion"
            />
            <RaisedButton
              disabled={isPlaying}
              onTouchTap={playSecondHalf}
              label="Run second portion"
            />
          </div>
          <Slider
            min={0}
            max={1}
            onChange={change}
            onDragStop={dragStop}
          />
        </div>
    );
  }
}
