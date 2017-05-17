'use strict';

const Koa    = require('koa'),
      logger = require('koa-logger'),
      router = require('./router');

const app = new Koa();

app.use(logger())
  .use(router.routes())
  .use(router.allowedMethods());

module.exports = app;
