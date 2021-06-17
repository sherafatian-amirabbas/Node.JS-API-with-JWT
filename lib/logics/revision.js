class Revision {
    constructor(id, issueId, currentIssue, changes, updatedAt, createdAt) {
        this.id = id;
        this.issueId = issueId;
        this.currentIssue = currentIssue;
        this.changes = changes;
        this.updatedAt = updatedAt;
        this.createdAt = createdAt;

        this.before = this.before.bind(this);
        this.after = this.after.bind(this);
    }

    before() {
        return this.currentIssue;
    }

    after() {
        const after = {};

        if(this.changes.title)
            after.title = this.changes.title;
        else
            after.title = this.currentIssue.title;

        if(this.changes.description)
            after.description = this.changes.description;
        else
            after.description = this.currentIssue.description;

        return after;
    }
};

Revision.fromModel = function(revisioinModel) {
    return new Revision(revisioinModel.id, revisioinModel.issueId, 
        JSON.parse(revisioinModel.currentIssue), JSON.parse(revisioinModel.changes), 
        revisioinModel.updatedAt, revisioinModel.createdAt)
};

module.exports = Revision;