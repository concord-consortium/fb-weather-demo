import { types } from "mobx-state-tree";
import * as moment from 'moment';

export const SimulationControl = types.model(
  "SimulationControl",
  {
    // properties
    startTime: types.maybe(types.Date),
    isPlaying: types.optional(types.boolean, false),
    time: types.maybe(types.Date),
    timeStep: types.optional(types.number, 60), // minutes per time step
    speed: types.optional(types.number, 1),

    // computed properties
    get moment() {
      return moment(this.time);
    }
  }, {
    // actions
    setStartTime(newTime: Date) {
      this.startTime = newTime;
    },
    setTime(newTime: Date) {
      this.time = newTime;
    },
    rewind() {
      if (this.startTime) {
        this.time = this.startTime;
      }
    },
    play() {
      this.isPlaying = true;
    },
    stop() {
      this.isPlaying = false;
    },
    stepForward() {
      const m = this.moment.add({ minutes: this.timeStep });
      this.setTime(m.toDate());
    },
    stepBack() {
      const m = this.moment.subtract({ minutes: this.timeStep });
      this.setTime(m.toDate());
    },

    // interval from moment.js, e.g. { minutes: 10 }
    advanceTime(interval: any) {
      if (this.time) {
        this.time = this.moment.add(interval).toDate();
      }
    }
  }
);
export type ISimulationControl = typeof SimulationControl.Type;
