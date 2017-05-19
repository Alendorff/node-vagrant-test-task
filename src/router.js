const Router    = require('koa-router'),
      jsonBody  = require('koa-json-body')({limit: '100kb'}),
      debug     = require('debug')('node-vagrant-test-task:router'),
      {Types}   = require('mongoose'),
      taskQueue = require('./taskQueue/taskQueue'),
      Result    = require('./models/result');

const router = new Router();

async function saveResult(ctx, next) {
  debug('ctx.request.body: %j', ctx.request.body);
  ctx.status = 200;
  let doc = {
    taskId: Types.ObjectId(ctx.request.body.module),
    data: ctx.request.body,
  };

  if (typeof ctx.isError !== 'undefined') doc.isError = ctx.isError;
  const res = new Result(doc);

  res.save();
  //noinspection JSIgnoredPromiseFromCall
  taskQueue.remove(ctx.request.body.module);
}

router.post('/saveReport', jsonBody, saveResult);

router.post('/saveError', jsonBody, (ctx, next) => {
  ctx.isError = true;
  next();
}, saveResult);

module.exports = router;
