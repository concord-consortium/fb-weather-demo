import * as React from "react";
import { observer } from "mobx-react";
import RaisedButton from "material-ui/RaisedButton";
import Slider from 'material-ui/Slider';
import { ComponentStyleMap } from "../utilities/component-style-map";
import { simulationStore } from "../models/simulation";

import { TimelineView} from "./timeline-view";

export interface SegmentedControlViewProps {}
export interface SegmentedControlViewState {
  splitTime?: number|null;
}

@observer
export class SegmentedControlView extends React.Component<
                                  SegmentedControlViewProps,
                                  SegmentedControlViewState> {

  render() {
    const simulation = simulationStore.selected;
    const isPlaying = !!(simulation && simulation.isPlaying);
    const playFirstHalf = () =>  simulation.playFirstHalf();
    const playSecondHalf = () => simulation.playSecondHalf();
    const reset = () => simulation.rewind();
    const dragStop = (o:any) => {
      if (simulation) {
        const newTime = this.state.splitTime;
        if(newTime) {
          simulation.setHalfTime(newTime);
        }
      }
    };

    const change   = (o:any, v:number) => this.setState ( {splitTime: v });
    const startTime = simulation && simulation.startTime;
    const endTime = simulation && simulation.endTime;
    const halfTime = simulation && simulation.halfTime;
    const currentTime = simulation && simulation.time;
    const style:ComponentStyleMap = {
      container: {
        display: "flex",
        flexDirection: "column",
        maxWidth: "500px",
        alignItems: "center"
      }
    };
    return(
      <div style={style.container} >
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
          <TimelineView
            startTime={startTime}
            halfTime={halfTime}
            currentTime={currentTime}
            endTime={endTime}
            />
          <Slider
            min={0}
            max={1}
            style={{width: "80%"}}
            onChange={change}
            onDragStop={dragStop}
          />
        </div>
    );
  }
}
