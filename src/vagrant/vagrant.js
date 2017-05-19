'use strict';

const config = require('../../config.json').vagrant || {
    "maxInstances": 2
  };

class Vagrant {
  constructor() {
    this._instances = {};
    this._amount = 0;
  }

  get amount() {
    return this._amount;
  }

  get canCreateInstance() {
    return this._amount < config.maxInstances;
  }

  getInstance(id) {
    return this._instances[id];
  }

  async terminateInstance(id) {
    this._amount--;
    delete this._instances[id];
    return Promise.resolve(true);
  }

  async runInstance(task) {
    this._amount++;
    this._instances[task.id] = {};
    return Promise.resolve(true);
  }
}

module.exports = new Vagrant();
