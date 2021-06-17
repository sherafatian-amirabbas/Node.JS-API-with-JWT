'use strict';

const Koa = require('koa');
const router = require('./lib/routes');
const session = require('./lib/session');

const app = new Koa();
const PORT = 8080;

app.use(require('koa-bodyparser')());

app.use(async (context, next) => { 
    context.session = session(context);
    await next(); 
});

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(PORT);
console.log('Listening on http://localhost:%s/', PORT);
