'use strict';

const redis           = require('redis'),
      taskQueue       = require('../taskQueue'),
      Watcher         = require('./Watcher'),
      watcherInterval = require('../../../config.json').taskWatcherInterval || 3000;


module.exports = new Watcher(() => {
  // retrieve docs from "tasks", which are not presented in "results" and "timeouted" collections

  // push those tasks into the taskQueue

}, watcherInterval);
