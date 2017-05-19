'use strict';

const mongoose = require('mongoose'),
      config   = require('../../config.json').mongodb;

const taskSchema = new mongoose.Schema({});
taskSchema.set('strict', false); // we know nothing about the fields so allow everything
taskSchema.set('collection', config.taskCollection);

module.exports = new mongoose.model('Task', taskSchema);
