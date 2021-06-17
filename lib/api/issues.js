'use strict';

const respond = require('./responses');
const issueLogics = require('../logics/issue');

module.exports = {
	get: async (context) => {
		const issue = await issueLogics.getIssueById(context.params.id);
		respond.success(context, issue);
	},

	getAll: async (context) => {
		const issues = await issueLogics.getIssues();
		respond.success(context, issues);
	},

	create: async (context) => {
		const createdIssue = await issueLogics.createNewIssue(context.request.body);
		respond.success(context, createdIssue);
	},

	update: async (context) => {
		const updatedIssue = await issueLogics.updateIssue(context.request.body);
		respond.success(context, updatedIssue);
	}
};