'use strict';

const respond = require('./responses');
const facade = require('../logics/facade');
const jwt = require('jsonwebtoken');
const koaJwt = require('../../middlewares/jwt');

module.exports = {
    register: async (context) => {
        const registeredUser = await facade.registerUser(context.request.body);
		respond.success(context, registeredUser.error ? registeredUser : { message: "user registered, please login." });
	},

	login: async (context) => {
        const result = await facade.loginUser(context.request.body);
        if(result.error) {
            context.body = result;
            context.status = 401; // unauthorized
        }
        else if (!result.isAuthenticated) {
            context.body = {
                message: "authentication failed!"
            };
            context.status = 401; // unauthorized
        }
        else {
            // for further requests, token should be added to the header "Authorization" with the 
            // value of "Bearer <token>"

            respond.success(context, {
                token: jwt.sign({ email: result.user.email }, koaJwt.secret)
            });
        }
	}
};