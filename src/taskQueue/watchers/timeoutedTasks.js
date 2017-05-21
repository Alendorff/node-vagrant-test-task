'use strict';

const redis     = require('redis'),
      Watcher   = require('./Watcher'),
      taskQueue = require('../taskQueue'),
      config    = require('../../../config.json').vagrant;

module.exports = new Watcher(() => {
  // check activeTasks

  // check if ts < (Date.now() - config.timeout) and finish it from task queue

}, config.terminateInterval);
