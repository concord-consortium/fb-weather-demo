import * as React from "react";
import { observer } from "mobx-react";
import RaisedButton from "material-ui/RaisedButton";
//import Slider from 'material-ui/Slider';
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
    // const playFirstHalf = () =>  simulation.playFirstHalf();
    // const playSecondHalf = () => simulation.playSecondHalf();
    const reset = () => simulation.rewind();
    // disable dragging (at least for now)
    // const dragStop = (o:any) => {
    //   if (simulation) {
    //     const newTime = this.state.splitTime;
    //     if(newTime) {
    //       simulation.setHalfTime(newTime);
    //     }
    //   }
    // };

    // const change   = (o:any, v:number) => this.setState ( {splitTime: v });
    const startTime = simulation && simulation.startTime;
    const endTime = simulation && simulation.endTime;
    const halfTime = simulation && simulation.halfTime;
    const currentTime = simulation && simulation.time;
    const isAtBeginning = currentTime && startTime && currentTime <= startTime;
    const isAtEnd = currentTime && endTime && currentTime >= endTime;
    const playPauseIcon = isPlaying ? "icon-pause" : "icon-play_arrow";
    const playPauseAction = isPlaying ? simulation.stop : simulation.play;
    const style:ComponentStyleMap = {
      container: {
        display: "flex",
        flexDirection: "column",
        maxWidth: 500,
        height: 110,
        alignItems: "center"
      },
      buttonStyle: {
        padding: "0 4px"
      },
      iconStyle: {
        color: "#FFF",
        fontSize: 24
      }
    };
    return(
      <div style={style.container} >
          <div>
            <RaisedButton
              style={style.buttonStyle}
              disabled={!simulation || isAtBeginning || isPlaying}
              onTouchTap={reset}
              icon={<i className="icon-refresh" style={style.iconStyle} />}
              label="Reset"
              primary={true}
            />
            <RaisedButton
              buttonStyle={style.buttonStyle}
              disabled={!simulation || isAtEnd}
              onTouchTap={playPauseAction}
              icon={<i className={playPauseIcon} style={style.iconStyle} />}
              label={isPlaying ? "Pause" : "Play"}
              primary={true}
            />
          </div>
          <TimelineView
            startTime={startTime}
            halfTime={halfTime}
            currentTime={currentTime}
            endTime={endTime}
            />
          {/* <Slider
            min={0}
            max={1}
            style={{width: "80%"}}
            onChange={change}
            onDragStop={dragStop}
          /> */}
        </div>
    );
  }
}
