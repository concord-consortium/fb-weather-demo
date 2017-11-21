import * as React from "react";
import * as moment from 'moment';

import { ComponentStyleMap } from "../utilities/component-style-map";

export interface TimelineViewProps {
  startTime: Date | null;
  currentTime: Date | null;
  halfTime: Date | null;
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
        margin: "0.5em"
      },
      date: {
      },
      time: {
        fontWeight: "bold"
      }
    };
    const dateFormat = "MMM D";
    const timeFormat = "hh:mm a";
    const dateString = moment(time).format(dateFormat);
    const timeString = moment(time).format(timeFormat);
    return (
      <div style={style.container}>
        <div style={style.date}>
          {dateString}
        </div>
        <div style={style.time}>
          {timeString}
        </div>
      </div>
    );
  }

  render() {
    const {startTime, currentTime, halfTime, endTime } = this.props;
    const start      = (startTime && startTime.getTime() || 0);
    const end        = (endTime   && endTime.getTime()   || 0);
    const split      = (halfTime  && halfTime.getTime()  || 0);
    const current    = (currentTime && currentTime.getTime() || 0);
    const duration   = end - start;
    const splitFrac    = (split - start) / duration;
    const currentFac   = (current - start) / duration;

    const style:ComponentStyleMap = {
      container: {
        display: "flex",
        flexDirection: "row",
        margin: "1em",
        alignItems: "center"
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
        backgroundColor: "gray"
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
          <div style={style.splitMarker} />
          {this.renderMoment(halfTime as Date)}
        </div>
        <div style={style.end}>
          {this.renderMoment(endTime as Date)}
        </div>
      </div>
    );
  }
}
