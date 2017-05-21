'use strict';

/**
 * Wrapper on setInterval(..) function allowing to restart
 */
class Watcher {
  constructor(fn, interval) {
    this._fn = fn;
    this._interval = interval;
    this._timer = null;
  }

  start() {
    this.stop();
    this.timer = setInterval(this._fn, this._interval);
  }

  stop() {
    clearInterval(this.timer);
  }
}

module.exports = Watcher;
