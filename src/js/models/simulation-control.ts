import { types } from "mobx-state-tree";
import * as moment from 'moment';

export const SimulationControl = types.model(
  "SimulationControl",
  {
    // properties
    time: types.maybe(types.Date),

    // computed properties
    get moment() {
      return moment(this.time);
    }
  }, {
    // actions
    setTime: function(newTime: Date) {
      this.time = newTime;
    },

    // interval from moment.js, e.g. { minutes: 10 }
    advanceTime: function(interval: any) {
      if (this.time) {
        this.time = this.moment.add(interval).toDate();
      }
    }
  }
);
export type ISimulationControl = typeof SimulationControl.Type;
