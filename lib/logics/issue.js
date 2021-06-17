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

    createNewIssue: async ({title, description}, session) => {
        const issue = new Issue(title, description, session);
        return await issue.create();
    },

    updateIssue: async({id, title, description}, session) => {
        const issue = new Issue(title, description, session, id);
        return await issue.update();
    }
};

class Issue{
    constructor(title, description, session, id = null){
        this.id = id;
        this.title = title;
        this.description = description;
        this.session = session;

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
            // managed transaction
            return await sequelize.transaction(async (t) => {
                const currentIssue = {
                    title: this.title,
                    description: this.description
                };

                const issue = await IssueEntity.create({
                    ...currentIssue,
                    created_by: this.session.email,
                    updated_by: this.session.email
                }, 
                { transaction: t });

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
            const originalIssue = await IssueEntity.findById(this.id);
            if(originalIssue) {

                // current state of the issue
                // keep it ouside of the transaction - to have it lightweight
                const currentIssue_serialized = JSON.stringify({
                    title: originalIssue.title, 
                    description: originalIssue.description
                });


                // keeping track of changed properties for further use
                // keep it ouside of the transaction - to have it lightweight
                const changes = {};
                if(this.title != originalIssue.title)
                    changes["title"] = this.title;

                if(this.description != originalIssue.description)
                    changes["description"] = this.description;


                // managed transaction
                return await sequelize.transaction(async (t) => {
                    const result = await IssueEntity.update({
                            title: this.title,
                            description: this.description,
                            created_by: originalIssue.created_by,
                            updated_by: this.session.email
                        },
                        {
                            where: {id: this.id},
                            transaction: t
                        });

                    await RevisionEntity.create({
                            issueId: this.id,
                            currentIssue: currentIssue_serialized,
                            changes: JSON.stringify(changes)
                        }, 
                        { transaction: t });

                    return result;
                });
            }
            else {
                validationResult.error = true;
                validationResult.message = 'issue not found!';
                return validationResult;
            }
        }
    }
}