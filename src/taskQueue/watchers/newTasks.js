'use strict';

const redis     = require('redis'),
      debug     = require('debug')('node-vagrant-test-task:newTaskWatcher'),
      taskQueue = require('../taskQueue'),
      Watcher   = require('./Watcher'),
      Task      = require('../../models/Task'),
      Timeouted = require('../../models/Timeouted'),
      Result    = require('../../models/Result'),
      config    = require('../../../config.json').mongodb;


module.exports = new Watcher(async () => {
  debug('Task watcher called!');
  // retrieve docs from "tasks", which are not presented in "results" and "timeouted" collections
  // perhaps it's better to use mongodb driver here and retrieve data with some tricky query
  // like get docs from collection A which not in B and C
  // or not...

  const [timeoutedTasks, finishedTasks] = await Promise.all([Timeouted.find(), Result.find()]);
  const newTasks = await Task.find(config.taskCollectionFilter)
    .and([
      {
        _id: {
          $nin: timeoutedTasks.concat(finishedTasks).map((doc) => doc.taskId)
        }
      }
    ]);

  debug('timeoutedTasks=%j', timeoutedTasks);
  debug('finishedTasks=%j', finishedTasks);
  debug('newTasks=%j', newTasks);

  // push those tasks into the taskQueue one after one
  let p = Promise.resolve(true);
  newTasks.forEach((task) => {
    p = p.then(() => taskQueue.add(task));
  });

  return p;
}, config.taskWatcherInterval);
