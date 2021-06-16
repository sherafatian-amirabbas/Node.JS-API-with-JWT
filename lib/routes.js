'use strict';

const Router = require('koa-router');
const Issues = require('./api/issues');

const router = new Router();

router.get('/', require('./api/discovery'));
router.get('/health', require('./api/health'));

router.get('/issues/:id', Issues.get);
router.get('/issues', Issues.getAll);
router.post('/issues', Issues.create);
router.put('/issues', Issues.update);

module.exports = router;
