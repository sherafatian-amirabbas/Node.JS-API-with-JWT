'use strict';

const Router = require('koa-router');
const issues = require('./api/issues');

const router = new Router();

router.get('/', require('./api/discovery'));
router.get('/health', require('./api/health'));

router.get('/issues/:id', issues.get);
router.get('/issues', issues.getAll);
router.post('/issues', issues.create);
router.put('/issues', issues.update);

module.exports = router;
