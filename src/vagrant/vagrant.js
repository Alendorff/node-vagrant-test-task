'use strict';

const debug  = require('debug')('node-vagrant-test-task:vagrant'),
      config = require('../../config.json').vagrant;

class Vagrant {
  constructor() {
    this._instances = {};
    this._amount = 0;
  }

  /**
   * @returns {boolean}
   */
  get canCreateInstance() {
    debug('vagrant active instances amount=%d', this._amount);
    return this._amount < config.maxInstances;
  }

  getInstance(id) {
    return this._instances[id];
  }

  /**
   * @param taskId
   * @returns {Promise.<boolean>}
   */
  async terminateInstance(taskId) {
    debug('terminate instance for taskId=%s', taskId);
    this._amount--;
    delete this._instances[taskId];
    return Promise.resolve(true);
  }

  /**
   * @param task {object}
   */
  runInstance(task) {
    debug('runInstance called with task=%j', task);
    if (!task) return;
    this._amount++;
    this._instances[task.id] = {};

    // stub function, copy-pasted from router saveResult middleware
    const delay = Math.round(1000 * (1 + Math.random() * 10));
    debug('task=%j should be finished after %d ms', task, delay);
    setTimeout(() => {

      // >>> to avoid circular dependencies problems import it here, also only stub needs it
      const taskQueue = require('../taskQueue'),
            {Types}   = require('mongoose'),
            Result    = require('../models/Result');
      // <<<

      const stubJSON = {
        module: task.id,
        stub: true
      };

      let doc = {
        taskId: Types.ObjectId(stubJSON.module),
        data: stubJSON,
      };

      const res = new Result(doc);

      res.save().then(() => {
        debug('Result saved=%j', res);
        //noinspection JSIgnoredPromiseFromCall
        taskQueue.finish(stubJSON.module);
      });
    }, delay);

    return task.id;
  }
}

module.exports = new Vagrant();
