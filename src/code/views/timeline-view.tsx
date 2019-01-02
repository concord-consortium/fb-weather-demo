import * as React from "react";
import * as moment from 'moment';

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
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
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
    const currentFac   = (current - start) / duration;

    const style:ComponentStyleMap = {
      container: {
        display: "flex",
        flexDirection: "row",
        margin: "1em",
        alignItems: "center",
        width: "100%"
      },
      bar: {
        display: "inline-block",
        height: "12px",
        width: "50vw",
        border: "1px solid gray",
        margin: "0px",
        padding: "0px"
      },
      filling: {
        height: "12px",
        margin: "0px",
        padding: "0px",
        width: `${currentFac * 100}%`,
        backgroundColor: "rgb(0, 188, 212)"
      },
      splitMarker: {
        margin: "0px",
        padding: "0px",
        position: "relative",
        backgroundColor: "black",
        width: "4px",
        left: `${splitFrac * 100}%`,
        height: "8px"
      }
    };
    return (
      <div style={style.container}>
        <div style={style.start}>
          {this.renderMoment(startTime as Date)}
        </div>
        <div style={style.bar}>
          <div style={style.filling} />
          <div style={style.splitMarker}>
            <div style={{position:"relative", top: "12px", left: "-55px"}}>
              {this.renderMoment(breakTime as Date)}
            </div>
          </div>
        </div>
        <div style={style.end}>
          {this.renderMoment(endTime as Date)}
        </div>
      </div>
    );
  }
}
