'use strict';

const respond = require('./responses');
const facade = require('../logics/facade');

module.exports = {
	get: async (context) => {
		const issue = await facade.getIssueById(context.params.id);
		respond.success(context, issue);
	},

	getAll: async (context) => {
		const issues = await facade.getIssues();
		respond.success(context, issues);
	},
 
    getRevisionDifferences: async (context) => {
        const difference = await facade.getRevisionDifferences(context.params.id, 
            context.params.id_revisionA, context.params.id_revisionB, context.params.isDescending);
		respond.success(context, difference);
    },

	create: async (context) => {
		const createdIssue = await facade.createNewIssue(context.request.body, context.session);
		respond.success(context, createdIssue);
	},

	update: async (context) => {
		const updatedIssue = await facade.updateIssue(context.request.body, context.session);
		respond.success(context, updatedIssue);
	}
};