'use strict';

// need to specify connection string for redis too

const redis    = require("redis"),
      bluebird = require('bluebird'),
      redisUrl = process.env.URL_REDIS || require('../config.json').redis.url;

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

const client = redis.createClient(redisUrl);
client.on("error", function (err) {
  console.error("Redis error: " + err);
});

process.on('SIGINT', function() {
  client.quit();
});

module.exports = client;
