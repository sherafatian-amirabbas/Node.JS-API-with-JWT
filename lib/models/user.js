'use strict';

const Sequelize = require('sequelize');
const sequelize = require('./connection');

module.exports = sequelize.define('user', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'id'
    },
    email: Sequelize.STRING,
    password: Sequelize.STRING,
	}, {
		timestamps: true,
		updatedAt: 'updated_at',
		createdAt: 'created_at',
		tableName: 'users'
    }
);
