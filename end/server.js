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

// 用户中心概览api
router.get('/api/user-survey', (ctx, next) => {
  ctx.body = { code: 0, data: { enabled: 100, sum: 108 } };
});

// 角色中心概览api
router.get('/api/role-survey', async (ctx, next) => {
  let body = {};
  // 这里假设角色中心的数据统计需要3秒才能返回.
  body = await delayData();
  ctx.body = body;
});

// 任务中心概览api
router.get('/api/task-survey', (ctx, next) => {
  ctx.body = { code: 0, data: { todo: 26, sum: 38 } };
});

// 产品中心概览api
router.get('/api/project-survey', (ctx, next) => {
  ctx.body = { code: 0, data: { healthy: 26, sum: 38 } };
});

app.use(async (ctx, next) => {
  // 暂时不考虑跨域问题, 所以这里粗暴的允许全部域, 生产中请勿这样做.
  ctx.set('Access-Control-Allow-Origin', '*');
  await next();
});

app.use(router.routes()).use(router.allowedMethods());

app.listen(8088);
