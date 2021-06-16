'use strict';

const respond = require('./responses');
const issueLogics = require('../logics/issue');

const baseUrl = 'http://localhost:8080';

module.exports = {

	get: async (context) => {
		const issue = await issueLogics.findIssueById(context.params.id);
		respond.success(context, { issue });
	},

	create: async (context) => {
		let createdIssue = await issueLogics.createNewIssue(context.request.body);
		respond.success(context, createdIssue);
	}

};