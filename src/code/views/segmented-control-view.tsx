import * as React from "react";
import { observer } from "mobx-react";
import RaisedButton from "material-ui/RaisedButton";
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
    const reset = () => simulation.rewind();

    const startTime = simulation && simulation.startTime;
    const endTime = simulation && simulation.endTime;
    const breakTime = simulation && simulation.breakTime;
    const currentTime = simulation && simulation.time;
    const isAtBeginning = currentTime && startTime && currentTime <= startTime;
    const isAtEnd = currentTime && endTime && currentTime >= endTime;
    const playPauseIcon = isPlaying ? "icon-pause" : "icon-play_arrow";
    const playPauseAction = isPlaying ? simulation.stop : simulation.play;
    const skipToTime = simulation && currentTime < breakTime ? breakTime : endTime;
    const skipAction = () => { if (skipToTime) { simulation.setTime(skipToTime); } };
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
      skipButtonStyle: {
        marginLeft: 4
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
            <RaisedButton
              buttonStyle={style.skipButtonStyle}
              disabled={!simulation || isPlaying || isAtEnd}
              onTouchTap={skipAction}
              icon={<i className="icon-skip_next" style={style.iconStyle} />}
              label={"Skip"}
              primary={true}
            />
          </div>
          <TimelineView
            startTime={startTime}
            breakTime={breakTime}
            currentTime={currentTime}
            endTime={endTime}
          />
        </div>
    );
  }
}
