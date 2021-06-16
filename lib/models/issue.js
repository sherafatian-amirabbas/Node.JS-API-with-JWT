'use strict';

const Sequelize = require('sequelize');
const sequelize = require('./connection');
const Revision = require('./revision');

module.exports = sequelize.define('issue', {
	id: {
		type: Sequelize.INTEGER,
		primaryKey: true,
		autoIncrement: true,
		field: 'id'
	},
	title: Sequelize.STRING,
	description: Sequelize.STRING,
	created_by: {
		type: Sequelize.STRING,
		defaultValue: 'unknown'
	},
	updated_by: {
		type: Sequelize.STRING,
		defaultValue: 'unknown'
	}
	}, {
		timestamps: true,
		updatedAt: 'updated_at',
		createdAt: 'created_at',
		tableName: 'issues',
		classMethods: {
		associate : function(models) {
				issueModel.hasMany(Revision, {as: "revisions"})
		},
	}
});
