'use strict';

const mongoose = require('mongoose'),
      config   = require('../../config.json').mongodb;

const timeoutedSchema = new mongoose.Schema({
  taskId: mongoose.Types.ObjectId,
  timeouted: mongoose.Types.Boolean
});
timeoutedSchema.set('collection', config.timeoutCollection);

module.exports = new mongoose.model('Timeouted', timeoutedSchema);
