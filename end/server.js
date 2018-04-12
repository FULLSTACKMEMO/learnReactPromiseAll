var Koa = require('koa');
var Router = require('koa-router');

var app = new Koa();
var router = new Router();

const delayData = () => {
  return new Promise((resole, reject) => {
    setTimeout(() => {
      const body = { code: 0, data: { bind: 2, sum: 6 } };
      resole(body);
    }, 3000);
  });
};

router.get('/api/user-survey', (ctx, next) => {
  ctx.body = { code: 0, data: { enabled: 100, sum: 108 } };
});

router.get('/api/role-survey', async (ctx, next) => {
  let body = {};
  body = await delayData();
  ctx.body = body;
});

router.get('/api/task-survey', (ctx, next) => {
  ctx.body = { code: 0, data: { todo: 26, sum: 38 } };
});

router.get('/api/project-survey', (ctx, next) => {
  ctx.body = { code: 0, data: { healthy: 26, sum: 38 } };
});

app.use(async (ctx, next) => {
  ctx.set('Access-Control-Allow-Origin', '*');
  await next();
});

app.use(router.routes()).use(router.allowedMethods());

app.listen(8088);
