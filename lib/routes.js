'use strict';

const Router = require('koa-router');
const issuesAPI = require('./api/issues');
const userAPI = require('./api/user');
const koaJwt = require('../middlewares/jwt');

const router = new Router();

router.get('/', require('./api/discovery'));
router.get('/health', require('./api/health'));

router.post('/user/register', userAPI.register);
router.post('/user/login', userAPI.login);

router.get('/issues/:id', issuesAPI.get);
router.get('/issues', issuesAPI.getAll);
router.post('/issues', koaJwt.jwt, issuesAPI.create);
router.put('/issues', koaJwt.jwt, issuesAPI.update);

module.exports = router;
