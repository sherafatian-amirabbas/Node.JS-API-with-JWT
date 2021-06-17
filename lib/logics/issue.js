const IssueEntity = require('../models/issue');
const RevisionEntity = require('../models/revision');
const Revision = require('./revision');
const sequelize = require('../models/connection');
const { Op } = require("sequelize");


module.exports = class Issue{
    constructor(title, description, id = null){
        this.id = id;
        this.title = title;
        this.description = description;

        this.validate = this.validate.bind(this);
        this.create = this.create.bind(this);
        this.update = this.update.bind(this);
        this.getRevisionDifferences = this.getRevisionDifferences.bind(this);
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

    async create(session){
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
                    created_by: session.email,
                    updated_by: session.email
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

    async update(session){
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
                    changes.title = this.title;

                if(this.description != originalIssue.description)
                    changes.description = this.description;


                // managed transaction
                return await sequelize.transaction(async (t) => {
                    const result = await IssueEntity.update({
                            title: this.title,
                            description: this.description,
                            created_by: originalIssue.created_by,
                            updated_by: session.email
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

    async getRevisionDifferences(id_revisionA, id_revisionB, isDescending = false){
        const revisions = RevisionEntity..findAll({
            where: {
                issueId: this.id,
                id: {
                    [Op.gte]: id_revisionA,
                    [Op.lte]: id_revisionB
                }
            }
        });

        if(!revisions || revisions.length == 0) return {};

        const revisionA = Revision.fromModel(revisions[0]);
        const revisionB = Revision.fromModel(revisions[revisions.length - 1]);
        
        const afterA = revisionA.after()
        const issueA = new Issue(afterA.title, afterA.description);

        const afterB = revisionB.after()
        const issueB = new Issue(afterB.title, afterB.description);

        const changes = isDescending ? issueB.subtract(issueA): issueA.subtract(issueB);

        result = {
            issue: {
                before: revisionA.before(),
                after: revisionB.after()
            },
            changes: changes,
            revisions: revisions
        };

        return result;
    }

    subtract(issue) {
        const changes = {};
        if(this.title != issue.title)
            changes.title = issue.title;

        if(this.description != issue.description)
            changes.description = issue.description;

        return changes;
    }
};