import { types } from "mobx-state-tree";
import * as moment from 'moment';

const kOverrides = {
        timeStep: 1,
        timeScale: 60,
        updateInterval: 1
      };

export const  SimulationControl = types.model(
  "SimulationControl",
  {
    // properties
    startTime: types.maybe(types.Date), // UTC date
    isPlaying: types.optional(types.boolean, false),
    playOffset: types.optional(types.number, 0),  // seconds from start
    breakOffset: types.optional(types.number, 0), // seconds from start
    duration: types.optional(types.number, 0),    // seconds
    timeStep: types.optional(types.number, kOverrides.timeStep),    // minutes per time step
    timeScale: types.optional(types.number, kOverrides.timeScale),  // wall-time to simulation time multiplier.
    updateInterval: types.optional(types.number, kOverrides.updateInterval),  // updates frame rate.
    get time(): Date | null {
      return this.startTime && moment.utc(this.startTime).add({ seconds: this.playOffset }).toDate();
    },
    get breakTime(): Date | null {
      return this.startTime && moment.utc(this.startTime).add({ seconds: this.breakOffset }).toDate();
    },
    get endTime():Date|null {
      return this.startTime && moment.utc(this.startTime).add({ seconds: this.duration }).toDate();
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
    setTimeRange(startTime: Date, duration: number, breakProportion?: number) {
      this.startTime = moment.utc(startTime).utcOffset(0, true).toDate();
      this.duration = duration;
      if (breakProportion != null) {
        this.breakOffset = breakProportion * duration;
      }
    },
    setTime(time: Date) {
      if (this.startTime && time) {
        const diff = Math.max(0, (time.getTime() - this.startTime.getTime()) / 1000);
        this.playOffset = Math.min(this.duration, diff);
      }
    },
    rewind() {
      this.playOffset = 0;
    },
    setUpdateInterval(updateInterval: number) {
      this.updateInterval = updateInterval;
    },
    setTimeScale(timeScale: number) {
      this.timeScale = timeScale;
    },
    enableTimer(stopOffset: number) {
      const sleepMs = this.updateInterval * 1000;

      if (!this.isPlaying) {
        this._clearTimer();
        this.timer = setInterval(() => {
          if (stopOffset && this.playOffset >= stopOffset) {
            this.stop();
          }
          else {
            const simSeconds = this.updateInterval * this.timeScale;
            this.advanceTime(simSeconds);
          }
        }, sleepMs);
        this.isPlaying = true;
      }
    },
    play() {
      const stopOffset = this.playOffset < this.breakOffset ? this.breakOffset : this.duration;
      this.enableTimer(stopOffset);
    },
    stop() {
      this._clearTimer();
      this.isPlaying = false;
    },

    _clearTimer() {
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
    },

    advanceTime(seconds: number) {
      this.playOffset += seconds;
    }
  }
);
export type ISimulationControl = typeof SimulationControl.Type;
