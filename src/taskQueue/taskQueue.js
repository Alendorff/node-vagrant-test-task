'use strict';

const redis   = require('redis'),
      config  = require('../../config.json'),
      vagrant = require('../vagrant/vagrant');

/**
 * It's more like controller over Redis, queue itself stored in Redis.
 */
class TaskQueue {
  constructor(redis) {
    this.r = redis;
  }

  async getNextTask() {
    // <REDIS REQUEST TO ORDERED SET tasks HERE>
    return this.r;
  }

  async getActiveTasks() {
    // <REDIS REQUEST TO ORDERED SET tasks HERE>
    return this.r;
  }

  async getQueueSize() {
      // <SOME REDIS REQUEST HERE>
  }

  async add(task) {
    const queueSize = await this.getQueueSize();

    // if possible - handle immediately
    if (!queueSize && vagrant.canCreateInstance) {
      handle(task);
    } else {
      // otherwise add it to redis "tasks" collection
    }
  }

  async handleNextTask() {
    await this.handle(await this.getNextTask());
  }

  async handle(task) {
    if (!task || !vagrant.canCreateInstance) return false;

    // move task from "tasks" collection to "activeTasks" collection. Structure is the same.

    // store taskId in redis (task:id = keys) and ZADD currentTasks Date.now() task.id

    // run vagrant instance
  }

  async remove(taskId) {
    // stop the vagrant associated with taskId
    await vagrant.terminateInstance(taskId);
    // remove taskId from redis activeTasks
    // await <REDIS REQUEST HERE>

    this.handleNextTask();
  }
}

module.exports = new TaskQueue(redis.createClient());
