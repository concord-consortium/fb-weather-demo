import * as React from "react";
import * as moment from 'moment';

import Slider from 'material-ui/Slider';
import { ComponentStyleMap } from "../utilities/component-style-map";
import { simulationStore } from "../models/simulation";

export interface TimelineViewProps {
  startTime: Date | null;
  currentTime: Date | null;
  breakTime: Date | null;
  endTime: Date | null;
}

export interface TimelineViewState {
  splitTime?: number|null;
}

export class TimelineView extends React.Component<
                                  TimelineViewProps,
                                  TimelineViewState> {

  renderMoment(time:Date) {
    const style:ComponentStyleMap = {
      container: {
        fontSize: "9pt",
        // display: "flex",
        // alignItems: "center",
        // justifyContent: "center",
        // flexDirection: "column",
        margin: "0.5em",
        width: "100px"
      },
      date: {
      },
      time: {
        fontWeight: "bold"
      }
    };

    let m = moment.utc(time);
    const scenario = simulationStore.selected && simulationStore.selected.scenario;
    if (scenario && scenario.utcOffset) {
      m = m.utcOffset(scenario.utcOffset);
    }

    const timeFormat = "h:mm A";
    const timeString = m.format(timeFormat);
    return (
      <div style={style.container}>
        <div style={style.time}>
          {timeString}
        </div>
      </div>
    );
  }

  render() {
    const {startTime, currentTime, breakTime, endTime } = this.props;
    const start      = (startTime && startTime.getTime() || 0);
    const end        = (endTime   && endTime.getTime()   || 0);
    const split      = (breakTime  && breakTime.getTime()  || 0);
    const current    = (currentTime && currentTime.getTime() || 0);
    const duration   = end - start;
    const splitFrac    = (split - start) / duration;

    const style:ComponentStyleMap = {
      container: {
        display: "grid",
        gridTemplateRows: "42px 10px",
        gridTemplateColumns: "1fr 1fr 1fr",
        rowGap: 0,
        columnCap: 0
      },
      startTime: {
        gridRow: "1",
        gridColumn: "1",
        position: "relative",
        left: "50px",
        paddingTop: "20px"
      },
      slider: {
        gridRow: "1",
        gridColumn: "2",
        width: "15em",
        top: "10px"
      },
      endTime: {
        gridRow: "1",
        gridColumn: "3",
        paddingTop: "20px"
      },
      splitTime: {
        gridRow: "2/3",
        gridColumn: "2"
      },
      splitMarker: {
        position: "relative",
        margin: "-2px",
        padding: "0px",
        paddingTop: "1px",
        backgroundColor: "black",
        width: "4px",
        left: `${splitFrac * 100}%`,
        height: "8px"
      },
      splitMarkerLabel: {
        paddingTop: "4px",
        marginLeft: "-20px"
      }
    };

    const stop = () => {
      const s = simulationStore.selected;
      if (s) {
        s.stop();
      }
    };

    const setTime = (value: number) => {
      const s = simulationStore.selected;
      const newTime = new Date(value);
      if (s) {
        s.stop();
        s.setTime(newTime);
        }
    };

    const onScrubberMove = (_:any, value: number) => {
      stop();
      setTime(value);
    };

    return (
      <div style={style.container}>
        <div style={style.startTime}>
          {this.renderMoment(startTime as Date)}
        </div>
        <div style={style.slider}>
          <Slider min={start} max={end} value={current} onChange={onScrubberMove} />
        </div>
        <div style={style.endTime}>
          {this.renderMoment(endTime as Date)}
        </div>
        <div style={style.splitTime}>
          <div style={style.splitMarker}>
            <div style={style.splitMarkerLabel}>
              {this.renderMoment(breakTime as Date)}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
