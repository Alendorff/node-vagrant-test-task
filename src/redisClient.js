'use strict';

const redis    = require("redis"),
      bluebird = require('bluebird'),
      redisUrl = process.env.URL_REDIS || require('../config.json').redis.url;

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

module.exports = function () {
  const client = redis.createClient(redisUrl);
  client.on("error", function (err) {
    console.error("Redis error: " + err);
  });

  return client;
};
