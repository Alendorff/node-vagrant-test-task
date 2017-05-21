'use strict';

const redis       = require('redis'),
      debug       = require('debug')('node-vagrant-test-task:taskQueue'),
      vagrant     = require('../vagrant'),
      redisClient = require('../redisClient')(),
      Task        = require('../models/Task'),
      config      = require('../../config.json').queue;

const {waitingQueue, activeQueue} = config;

/**
 * It's more like controller over Redis, queue itself stored in Redis.
 */
class TaskQueue {
  constructor(redis) {
    this.r = redis;
  }

  /**
   * @returns {Promise.<number>}
   */
  async getQueueSize() {
    return this.r.zcardAsync(waitingQueue);
  }

  async getActiveQueue(withScores = false) {
    return (withScores) ?
      this.r.zrangeAsync(activeQueue, 0, -1, 'WITHSCORES') :
      this.r.zrangeAsync(activeQueue, 0, -1);
  }

  /**
   * Retrieves the first element in the queue and remove it from
   * @returns {Promise.<string>}
   */
  async getNextTaskId() {
    return this.r.zrangeAsync(waitingQueue, 0, 0).then((r) => r[0] ? r[0] : null);
  }

  /**
   * Add task into queue or handle it immediately if possible
   * @param {Object} task
   * @returns {Promise.<void>}
   */
  async add(task) {
    const queueSize = await this.getQueueSize();
    debug('add called > current queue size = %d', queueSize);

    const currentRank = await this.r.zrankAsync(activeQueue, task.id);
    if (currentRank !== null) {
      debug('already handled=%j ', task);
    } else {
      debug('adding task to "tasks" collection. Task=%j', task);
      // NX means we won't update SCORES for existing records
      await this.r.zaddAsync(waitingQueue, 'NX', Date.now(), task.id);
      if (vagrant.canCreateInstance) {
        debug('will be handled right now: task=%j ', task);
        await this.handle(task);
      }
    }
  }

  /**
   * Move task from "tasks" collection to "activeTasks" collection and run vagrant instance for it
   * @param {string|object} task
   * @returns {Promise.<void>}
   */
  async handle(task) {
    debug('handle called, vagrant.canCreateInstance=%s; handle task=%j', vagrant.canCreateInstance ? "true" : "false", task);

    if (!vagrant.canCreateInstance) {
      debug('can not handle task right now. Task=%j', task);
      return Promise.resolve(null);
    }

    if (!task) throw new Error(`WTF with task ${task}`);

    let taskId, taskObj;
    if (typeof task === 'string') {
      taskId = task;
      taskObj = await Task.findById(taskId);
    } else {
      taskId = task.id;
      taskObj = task;
    }

    await Promise.all([
      this.r.zaddAsync(activeQueue, Date.now(), taskId),
      this.r.zremAsync(waitingQueue, taskId),
      vagrant.runInstance(taskObj)
    ])
      .then(r => debug('handle result=%j', (r)))
      .catch(e => console.error(e));
  }

  /**
   * Removes task from active queue, its associated vagrant instance should be terminated
   * and next task from waiting queue should start to be handled.
   * @param taskId
   * @returns {Promise.<void>}
   */
  async finish(taskId) {
    debug('finish called with taskId=%j', taskId);
    await Promise.all([
      this.r.zremAsync(activeQueue, taskId),
      vagrant.terminateInstance(taskId)
    ]);

    const next = await this.getNextTaskId();
    debug('next task id=%j', next);
    if (next) return this.handle(next);
  }
}

module.exports = new TaskQueue(redisClient);
