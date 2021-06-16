'use strict';

const Sequelize = require('sequelize');
const sequelize = require('./connection');
const IssueEntity = require('./issue');

module.exports = sequelize.define('revision', {
	id: {
		type: Sequelize.INTEGER,
		primaryKey: true,
		autoIncrement: true,
		field: 'id'
	},
	issueId: {
		type: Sequelize.INTEGER,    
		field: 'issue_id'
	},
	currentIssue: {
		type: Sequelize.INTEGER,    
		field: 'current_issue'
	},
	changes: Sequelize.STRING
	}, {
	timestamps: true,
	updatedAt: 'updated_at',
	createdAt: 'created_at',
	tableName: 'revisions',
	classMethods: {
			associate : function(models) {
					revisionModel.belongsTo(IssueEntity, {as: "issue", foreignKey: 'issue_id'})
			},
		}
});