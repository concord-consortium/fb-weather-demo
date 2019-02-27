import { types, onSnapshot } from "mobx-state-tree";
import * as moment from 'moment';

const kOverrides = {
        timeStep: 1,
        timeScale: 60,
        updateInterval: 1
      };

const kTickRate = 2000;

export const SimulationControl = types
  .model("SimulationControl", {
    startTime: types.maybe(types.Date), // UTC date
    isPlaying: types.optional(types.boolean, false),
    playOffset: types.optional(types.number, 0),  // seconds from start
    breakOffset: types.optional(types.number, 0), // seconds from start
    duration: types.optional(types.number, 0),    // seconds
    timeStep: types.optional(types.number, kOverrides.timeStep),    // minutes per time step
    timeScale: types.optional(types.number, kOverrides.timeScale),  // wall-time to simulation time multiplier.
    updateInterval: types.optional(types.number, kOverrides.updateInterval),  // updates frame rate.
  })
  .volatile(self => ({
    timer: null as (number | null)
  }))
  .views(self => ({
    get time(): Date | null {
      return self.startTime && moment.utc(self.startTime).add({ seconds: self.playOffset }).toDate();
    },
    get breakTime(): Date | null {
      return self.startTime && moment.utc(self.startTime).add({ seconds: self.breakOffset }).toDate();
    },
    get endTime():Date|null {
      return self.startTime && moment.utc(self.startTime).add({ seconds: self.duration }).toDate();
    }
  }))
  .preProcessSnapshot(snapshot =>
    // add defaults for snapshot
    Object.assign({}, kOverrides, snapshot)
  )
  .actions(self => {

    // private/internal API
    function _setPlayOffset(offset: number) {
      self.playOffset = Math.min(Math.max(0, offset), self.duration);
    }

    function _clearTimer() {
      if (self.timer) {
        clearInterval(self.timer);
        self.timer = null;
      }
    }

    function _stop() {
      _clearTimer();
      self.isPlaying = false;
    }

    return {
      afterCreate() {
        onSnapshot(self, (snapshot: ISimulationControlSnapshot) => {
          // if we're not playing, stop any timers
          if (!snapshot.isPlaying) {
            _clearTimer();
          }
        });
      },
      setTimeRange(startTime: Date, duration: number, breakProportion?: number) {
        self.startTime = moment.utc(startTime).utcOffset(0, true).toDate();
        self.duration = duration;
        if (breakProportion != null) {
          self.breakOffset = breakProportion * duration;
        }
      },
      setTime(time: Date) {
        if (self.startTime && time) {
          _setPlayOffset((time.getTime() - self.startTime.getTime()) / 1000);
        }
      },
      rewind() {
        self.isPlaying = false;
        self.playOffset = 0;
      },
      setUpdateInterval(updateInterval: number) {
        self.updateInterval = updateInterval;
      },
      setTimeScale(timeScale: number) {
        self.timeScale = timeScale;
      },
      advanceTime(seconds: number) {
        _setPlayOffset(self.playOffset + seconds);
      },
      clearTimer() {
        _clearTimer();
      },
      stop() {
        _stop();
      },
      timerTick(stopOffset: number) {
        const interval = self.timeScale * Math.round(((kTickRate / 1000) / self.updateInterval));
        if (stopOffset && (self.playOffset + interval >= stopOffset)) {
          _setPlayOffset(stopOffset);
          _stop();
        }
        else {
          _setPlayOffset(self.playOffset + interval);
        }
      }
    };
  })
  .actions(self => {

    function _enableTimer(stopOffset: number) {
      if (!self.isPlaying) {
        self.clearTimer();
        self.timer = window.setInterval(() => {
          self.timerTick(stopOffset);
        }, kTickRate);
        self.isPlaying = true;
      }
    }

    return {
      play() {
        const stopOffset = self.playOffset < self.breakOffset ? self.breakOffset : self.duration;
        _enableTimer(stopOffset);
      },
      stepForward() {
        self.advanceTime(self.timeStep * 60);
      },
      stepBack() {
        self.advanceTime(-self.timeStep * 60);
      }
    };
  });
export type ISimulationControl = typeof SimulationControl.Type;
export type ISimulationControlSnapshot = typeof SimulationControl.SnapshotType;
