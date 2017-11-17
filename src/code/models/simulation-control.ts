import { types } from "mobx-state-tree";
import * as moment from 'moment';
import { simulationStore } from '../stores/simulation-store';
export const  SimulationControl = types.model(
  "SimulationControl",
  {
    // properties
    startTime: types.maybe(types.Date),
    isPlaying: types.optional(types.boolean, false),
    time: types.maybe(types.Date),
    halfTime: types.maybe(types.Date),
    timeStep: types.optional(types.number, 60), // minutes per time step
    speed: types.optional(types.number, 1),

    // computed properties
    get moment() {
      return moment(this.time);
    }
  }, {
    timer: null
  }, {
    // actions
    afterCreate() {
      if (this.isPlaying) {
        this.play();
      }
    },
    setStartTime(newTime: Date) {
      this.startTime = newTime;
    },
    setTime(newTime: Date) {
      this.time = newTime;
    },
    setHalfTime() {
      this.halfTime = this.time;
    },
    rewind() {
      if (this.startTime) {
        this.time = this.startTime;
      }
    },
    enableTimer(endTime: Date) {
      const sleepMs = (100/this.speed) * 1000;
      if (!this.isPlaying) {
        this._clearTimer();
        this.timer = setInterval(() => {
          if(endTime && this.time >= endTime) {
            this.stop();
          }
          else {
            this.stepForward();
          }
        }, sleepMs);
        this.isPlaying = true;
      }
    },
    play() {
      const endTime = simulationStore.selected && simulationStore.selected.scenario.endTime;
      this.enableTimer(endTime);
    },
    playFirstHalf() {
      this.rewind();
      const endTime = this.halfTime || (simulationStore.selected && simulationStore.selected.scenario.endTime);
      this.enableTimer(endTime);
    },
    playSecondHalf() {
      const endTime = simulationStore.selected && simulationStore.selected.scenario.endTime;
      if (!this.isPlaying) {
        if(this.halfTime) {
          // this.setTime(this.halfTime);
          this.enableTimer(endTime);
        }
      }
    },
    stop() {
      this._clearTimer();
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

    _clearTimer() {
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
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
