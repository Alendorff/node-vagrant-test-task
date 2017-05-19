'use strict';

const mongoose   = require('mongoose');
const urlMongodb = process.env.URL_MONGODB || require('../config.json').mongodb.url;


mongoose.connect(urlMongodb);

const db = mongoose.connection;

db.on('error', (err) => {
  throw err;
});

process.on('SIGINT', function() {
  db.close(function () {
    console.log('Mongoose default connection disconnected through app termination');
    process.exit(0);
  });
});

module.exports = db;
