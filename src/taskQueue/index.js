'use strict';

const taskQueue             = require('./taskQueue'),
      timeoutedTasksWatcher = require('./watchers/timeoutedTasks'),
      newTasksWatcher       = require('./watchers/newTasks');

timeoutedTasksWatcher.start();
newTasksWatcher.start();

module.exports = taskQueue;