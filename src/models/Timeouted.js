'use strict';

const mongoose = require('mongoose'),
      Schema   = mongoose.Schema,
      config   = require('../../config.json').mongodb;

const timeoutedSchema = new mongoose.Schema({
  taskId: Schema.Types.ObjectId,
  timeouted: Schema.Types.Boolean
});
timeoutedSchema.set('collection', config.timeoutCollection);

module.exports = mongoose.model('Timeouted', timeoutedSchema);
