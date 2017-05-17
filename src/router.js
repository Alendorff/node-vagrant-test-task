const Router = require('koa-router'),
      jsonBody = require('koa-json-body')({limit: '100kb'}),
      debug = require('debug')('node-vagrant-test-task:router');

const router = new Router();

router.post('/saveReport', jsonBody, (ctx, next) => {
  debug('saveReport: %j', ctx.request.body);
  ctx.status = 200;
});

router.post('/saveError', jsonBody, (ctx, next) => {
  debug('saveError: %j', ctx.request.body);
  ctx.status = 200;
});

module.exports = router;