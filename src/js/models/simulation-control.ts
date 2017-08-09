import { types } from "mobx-state-tree";
import * as moment from 'moment';

export const SimulationControl = types.model(
  "SimulationControl",
  {
    // properties
    isPlaying: types.optional(types.boolean, false),
    time: types.maybe(types.Date),
    speed: types.optional(types.number, 1),

    // computed properties
    get moment() {
      return moment(this.time);
    }
  }, {
    // actions
    setTime(newTime: Date) {
      this.time = newTime;
    },
    play() {
      this.isPlaying = true;
    },
    stop() {
      this.isPlaying = false;
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
