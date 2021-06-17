const IssueEntity = require('../models/issue');
const Issue = require('./issue');
const User = require('./user');

module.exports = {
    // -------------------------------------------------------- user

    registerUser: async ({email, password}) => {
        const user = new User(email, password);
        return await user.register();
    },

    loginUser: async({email, password}) => {
        const user = new User(email, password);
        return await user.authenticate();
    },


    // -------------------------------------------------------- Issue

    getIssueById: async (id) => {
        return await IssueEntity.findById(id);
    },

    getIssues: async () => {
        return await IssueEntity.findAll();
    },

    getRevisionDifferences: async (id, id_revisionA, id_revisionB, isDescending) => {
        const issue = new Issue(null, null, id);
        return await issue.getRevisionDifferences(id_revisionA, id_revisionB, isDescending)
    },

    createNewIssue: async ({title, description}, session) => {
        const issue = new Issue(title, description);
        return await issue.create(session);
    },

    updateIssue: async({id, title, description}, session) => {
        const issue = new Issue(title, description, id);
        return await issue.update(session);
    }
};