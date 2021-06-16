const IssueEntity = require('../models/issue');
const RevisionEntity = require('../models/revision');
const sequelize = require('../models/connection');

module.exports = {
    getIssueById: async (id) => {
        return await IssueEntity.findById(id);
    },

    getIssues: async () => {
        return await IssueEntity.findAll();
    },

    createNewIssue: async ({title, description}) => {
        const issue = new Issue(title, description);
        return await issue.create();
    },

    updateIssue: async({id, title, description}) => {
        const issue = new Issue(title, description, id);
        return await issue.update();
    }
};

class Issue{
    constructor(title, description, id = null){
        this.id = id;
        this.title = title;
        this.description = description;

        this.validate = this.validate.bind(this);
    }

    validate(){
        const result = {error: false, message: ''};

        if(!this.title) {
            result.error = true;
            result.message = 'title is missing!!';
        }

        if(!this.description) {
            result.error = true;
            result.message = 'description is missing!!';
        }

        return result;
    }

    async create(){
        const validationResult = this.validate();
        if(validationResult.error)
            return validationResult;
        else {
            return await sequelize.transaction(async (t) => {
                const currentIssue = {
                    title: this.title,
                    description: this.description
                };

                const issue = await IssueEntity.create(currentIssue, { transaction: t });

                const currentIssue_serialized = JSON.stringify(currentIssue);
                await RevisionEntity.create({
                    issueId: issue.id,
                    currentIssue: currentIssue_serialized,
                    changes: currentIssue_serialized
                }, { transaction: t });

                return issue;
            });
        }
    }

    async update(){
        const validationResult = this.validate();
        if(validationResult.error)
            return validationResult;
        else {
            const issue = await IssueEntity.update({
                title: this.title,
                description: this.description
            },
            {
                where: {id: this.id}
            });

            return issue;
        }
    }
}