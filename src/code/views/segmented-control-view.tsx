import * as React from "react";
import { observer } from "mobx-react";
import { MuiThemeProvider } from 'material-ui-next/styles';
import Button from "material-ui-next/Button";
import Icon from "material-ui-next/Icon";
import theme from "../utilities/mui-default-theme";
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
    const reset = () => simulation && simulation.rewind();
    const play = () => simulation && simulation.play();
    const stop = () => simulation && simulation.stop();
    const setTime = (time: Date) => simulation && simulation.setTime(time);

    const startTime = simulation && simulation.startTime;
    const endTime = simulation && simulation.endTime;
    const breakTime = simulation && simulation.breakTime;
    const currentTime = simulation && simulation.time;
    const isAtBeginning = currentTime && startTime && currentTime <= startTime;
    const isAtEnd = currentTime && endTime ? currentTime >= endTime : false;
    const playPauseIcon = isPlaying ? "icon-pause" : "icon-play_arrow";
    const playPauseAction = isPlaying ? stop : play;
    const skipToTime = currentTime && breakTime && currentTime < breakTime ? breakTime : endTime;
    const skipAction = () => { if (skipToTime) { setTime(skipToTime); } };
    const style:ComponentStyleMap = {
      container: {
        display: "flex",
        flexDirection: "column",
        maxWidth: 500,
        height: 110,
        alignItems: "center"
      },
      buttonStyle: {
        marginLeft: 4
      },
      iconStyle: {
        color: "#FFF",
        fontSize: 24
      }
    };
    return(
      <MuiThemeProvider theme={theme}>
        <div style={style.container} >
          <div>
            <Button variant="raised"
              style={style.buttonStyle}
              disabled={!simulation || isAtBeginning || isPlaying}
              onClick={reset}
              color="primary"
            >
              <Icon className="icon-refresh" style={style.iconStyle}/>
              Reset
            </Button>
            <Button variant="raised"
              style={style.buttonStyle}
              disabled={!simulation || isAtEnd}
              onClick={playPauseAction}
              color="primary"
            >
              <Icon className={playPauseIcon} style={style.iconStyle}/>
              {isPlaying ? "Pause" : "Play"}
            </Button>
            <Button variant="raised"
              style={style.buttonStyle}
              disabled={!simulation || isPlaying || isAtEnd}
              onClick={skipAction}
              color="primary"
            >
              <Icon className="icon-skip_next" style={style.iconStyle}/>
              Skip
            </Button>
          </div>
          <TimelineView
            startTime={startTime}
            breakTime={breakTime}
            currentTime={currentTime}
            endTime={endTime}
          />
        </div>
      </MuiThemeProvider>
    );
  }
}
