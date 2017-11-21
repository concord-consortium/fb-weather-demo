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
    timeStep: types.optional(types.number, 15),      // minutes per time step
    timeScale: types.optional(types.number, 60),     // wall-time to simulation time mulitplier.
    updateIntervalS: types.optional(types.number, 5), // updates frame rate.
    get moment() {
      return moment(this.time);
    },
    get endTime():Date|null {
      return simulationStore.selected && simulationStore.selected.scenario.endTime;
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
    setHalfTime(newTime:Date) {
      this.halfTime = newTime;
      this.time = newTime;
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
      this.enableTimer(this.endTime);
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
