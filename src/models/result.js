'use strict';

const mongoose = require('mongoose'),
      Schema   = mongoose.Schema,
      config   = require('../../config.json').mongodb;

const resultSchema = new Schema({
  taskId: {type: Schema.Types.ObjectId, ref: 'Task'},
  data: Schema.Types.Mixed,
  isError: {type: Schema.Types.Mixed, default: false}
});
resultSchema.set('collection', config.resultCollection);

const result = mongoose.model('Result', resultSchema);

module.exports = result;
