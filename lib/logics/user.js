const UserEntity = require('../models/user');
const bcrypt = require('bcrypt');

module.exports = class User{
    constructor(email, password){
        this.email = email;
        this.password = password;

        if(this.password)
            this.password_hashed = bcrypt.hashSync(this.password, 10);

        this.validate = this.validate.bind(this);
        this.register = this.register.bind(this);
        this.authenticate = this.authenticate.bind(this);
    }

    validate(){
        const result = {error: false, message: ''};

        if(!this.email) {
            result.error = true;
            result.message = 'email is missing!!';
        }

        if(!this.password) {
            result.error = true;
            result.message = 'password is missing!!';
        }

        return result;
    }

    async register() {
        const validationResult = this.validate();
        if(validationResult.error)
            return validationResult;
        else {
            let user = await UserEntity.findOne({
                where : {
                    email: this.email
                }
            });

            if(user) {
                validationResult.error = true;
                validationResult.message = 'email is already registered!';
                return validationResult;
            }

            user = await UserEntity.create({
                email: this.email,
                password: this.password_hashed
            });

            return user;
        }
    }

    async authenticate() {
        const validationResult = this.validate();
        if(validationResult.error)
            return validationResult;
        else {
            const user = await UserEntity.findOne({
                where : {
                    email: this.email,
                }
            });

            if(user) {
                if(bcrypt.compareSync(this.password, user.password))
                    return {
                        error: false,
                        isAuthenticated: true,
                        user: user
                    };
                else
                    return {
                        error: false,
                        isAuthenticated: false
                    };
            }
            else {
                return {
                    error: false,
                    isAuthenticated: false
                };
            }
        }
    }
};