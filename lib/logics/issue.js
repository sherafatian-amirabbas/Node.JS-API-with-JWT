const issueModel = require('../models/issue');

module.exports = {
    getIssueById: async (id) => {
        return await issueModel.findById(id);
    },

    getIssues: async () => {
        return await issueModel.findAll();
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
            const issue = await issueModel.create({
                title: this.title,
                description: this.description
            });

            return issue;
        }
    }

    async update(){
        const validationResult = this.validate();
        if(validationResult.error)
            return validationResult;
        else {
            const issue = await issueModel.update({
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