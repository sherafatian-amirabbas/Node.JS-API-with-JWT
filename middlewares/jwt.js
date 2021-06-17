const koaJwt = require('koa-jwt');

module.exports = function() {
    const secret_key = 'secret_key'; // TODO: should be as env variable
    return {
        secret: secret_key,
        jwt: koaJwt({secret: secret_key})
    };
}();