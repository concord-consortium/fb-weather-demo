import { types } from "mobx-state-tree";
import * as moment from 'moment';
import { simulationStore } from '../models/simulation';

const kOverrides = {
  timeStep: 1,
  timeScale: 60,
  updateIntervalS: 1
};

export const  SimulationControl = types.model(
  "SimulationControl",
  {
    // properties
    startTime: types.maybe(types.Date),
    isPlaying: types.optional(types.boolean, false),
    time: types.maybe(types.Date),
    halfTime: types.maybe(types.Date),
    timeStep: types.optional(types.number, kOverrides.timeStep),    // minutes per time step
    timeScale: types.optional(types.number, kOverrides.timeScale),  // wall-time to simulation time multiplier.
    updateIntervalS: types.optional(types.number, kOverrides.updateIntervalS),  // updates frame rate.
    get moment() {
      return moment(this.time);
    },
    get endTime():Date|null {
      return simulationStore.selected.endTime;
    }
  }, {
    timer: null
  }, {
    // hooks
    preProcessSnapshot(snapshot: any) {
      // replace restored values with new hard-coded values
      return Object.assign({}, snapshot, kOverrides);
    },
    afterCreate() {
      if (this.isPlaying) {
        this.play();
      }
    },
    // actions
    setStartTime(newTime: Date) {
      this.startTime = newTime;
    },
    setTime(newTime: Date) {
      this.time = newTime;
    },
    setHalfTime(newTime:Date) {
      this.halfTime = newTime;
    },
    setUpdateIntervalS(newValue:string) {
      const parsed = parseInt(newValue,10) || 0;
      this.updateIntervalS = parsed;
    },
    setTimeScale(newValue: string) {
      const parsed = parseInt(newValue,10) || 0;
      this.timeScale = parsed;
    },
    rewind() {
      if (this.startTime) {
        this.time = this.startTime;
      }
    },
    enableTimer(endTime: Date) {
      const sleepMs = this.updateIntervalS * 1000;
      let lastTime = new Date().getTime();
      let newTime = new Date().getTime();

      if (!this.isPlaying) {
        this._clearTimer();
        this.timer = setInterval(() => {
          if(endTime && this.time >= endTime) {
            this.stop();
          }
          else {
            newTime = new Date().getTime();
            const elapsedS = (newTime - lastTime) / 1000;
            lastTime = newTime;
            const simSeconds = elapsedS * this.timeScale;
            this.advanceTime({seconds: simSeconds});
          }
        }, sleepMs);
        this.isPlaying = true;
      }
    },
    play() {
      const stopTime = this.time < this.halfTime ? this.halfTime : this.endTime;
      this.enableTimer(stopTime);
    },
    playFirstHalf() {
      this.rewind();
      const endTime = this.halfTime || simulationStore.selected.scenario.endTime;
      this.enableTimer(endTime);
    },
    playSecondHalf() {
      const endTime = simulationStore.selected.scenario.endTime;
      if (!this.isPlaying) {
        if(this.halfTime) {
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
