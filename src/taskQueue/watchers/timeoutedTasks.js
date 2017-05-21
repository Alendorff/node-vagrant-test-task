'use strict';

const debug     = require('debug')('node-vagrant-test-task:timeoutedTasksWatcher'),
      Watcher   = require('./Watcher'),
      taskQueue = require('../taskQueue'),
      Timeouted = require('../../models/Timeouted'),
      config    = require('../../../config.json').vagrant;

/**
 * Checks if some tasks handled too long and terminate them.
 * Save result about them in separate collection for timeouted tasks.
 */
module.exports = new Watcher(async () => {
  debug('Timeouted tasks watcher called!');
  const queueWithScores = await taskQueue.getActiveQueue(true);
  if (!queueWithScores.length) return;

  for (let i = 0; i < queueWithScores.length; ++i) {
    const taskId    = queueWithScores[i],
          timestamp = queueWithScores[++i];

    if (timestamp < Date.now() - config.timeout) {
      debug('found timeouted task. id=%j', taskId);
      const doc = new Timeouted({
        taskId,
        timeouted: true
      });
      doc.save().then(taskQueue.finish(taskId));
    }
  }

}, config.terminateInterval);
