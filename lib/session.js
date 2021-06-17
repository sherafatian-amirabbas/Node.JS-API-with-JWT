const koaJwt = require('../middlewares/jwt');
const jwt = require('jsonwebtoken');

module.exports = function(context){
    let email = ''
    
    if(context && context.headers) {
        const authHeader = context.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1]

        if (token != null) {
            try {
                var token_decoded = jwt.verify(token, koaJwt.secret);
                email = token_decoded.email;
            } catch(err) {}
        }
    }

    return {
        email: email
    };
};