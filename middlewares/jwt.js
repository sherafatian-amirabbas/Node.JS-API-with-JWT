const koaJwt = require('koa-jwt');

const secret_key = 'secret_key'; // TODO: should be as env variable

module.exports = {
    secret: secret_key,
    jwt: koaJwt({secret: secret_key})
};