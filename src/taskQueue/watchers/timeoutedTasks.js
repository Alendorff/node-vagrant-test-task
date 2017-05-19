'use strict';

const redis     = require('redis'),
      Watcher   = require('./Watcher'),
      taskQueue = require('../taskQueue'),
      config    = require('../../../config.json').vagrant || {
          timeout: 1000 * 60,
          terminateInterval: 2000
        };

module.exports = new Watcher(() => {
  // check activeTasks

  // check if ts < (Date.now() - config.timeout) and remove it from task queue

}, config.terminateInterval);
