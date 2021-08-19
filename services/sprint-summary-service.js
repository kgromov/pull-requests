const mongoose = require("mongoose");
const sprintService = require("./sprint-service");
const devService = require("./developer-service");
const Sprint = require("./../model/sprint").Sprint;
const Developer = require("./../model/developer").Developer;
const PullRequest = require("./../model/pull-requests").PullRequest;
const sprintsSummaryData = require("./../model/sprint-summary").summary;
const SprintSummary = require("./../model/sprint-summary").SprintSummary;

// =========== summary ==============
exports.getSprintSummary = async function(sprintNumber) {
    const result = await SprintSummary.findOne({sprint: sprintNumber})
            .sort({"pullRequests.count": -1});
    console.log(`sprint ${sprintNumber} summary: ${result}`);
    return result === null ? {pullRequests: []} : result;
} 

exports.getDevSprintSummaries = async function(devName) {
    const result = await SprintSummary.find(
                        {"pullRequests.developer": devName}, 
                        {sprint: 1, pullRequests: {$elemMatch: {developer: devName}}}
            )
            .sort({"sprint": -1});
    console.log(`${devName} summary: ${result}`);
    return result;       
}

exports.addSprint = async function(sprint) {
    console.log('sprint = ' + sprint);
    const summary = new SprintSummary({sprint: sprint.number, pullRequests: []}); 
    return await summary.save();
}

exports.addDeveloper = async function(dev) {
    const sprintNumber = await sprintService.getLatestSprintNumber();
    const sprint = await getSprintSummary(sprintNumber);
    const newDeveloper = new PullRequest({
        developer: dev.name,
        count: 0
    });
    sprint.pullRequests.push(newDeveloper);
    return await sprint.save();
}

exports.updateDeveloper = async function(sprintNumber, devName, newCount) {
    // const sprint = await SprintSummary.findOneAndUpdate(
    //     {sprint: sprintNumber},
    //     {
    //         "pullRequests.$.developer": devName,
    //         "pullRequests.$.count": newCount
    //     },
    //     {upsert: true}
    // );
    const sprint = await SprintSummary.findOne({sprint: sprintNumber});
    // _id: new mongoose.Types.ObjectId(),
    const dev = sprint.pullRequests.find(pr => pr.developer === devName) 
            || new PullRequest({developer: devName, count: newCount});
    console.log(dev);
    sprint.pullRequests.push(dev);
    console.log(sprint);
    return await sprint.save();
}

// TODO: incorrect schema
exports.updateDeveloperPromise = async function(sprintId, devId, newCount) {
    return Sprint.findById(sprintId)
        .then(sprint => {
            const developer = sprint.developers.id(devId);
            developer.count = newCount;
            sprint.save();
        }).catch(err => {
            console.log('Oh! Dark')
        });
}

exports.updateDeveloperPromise = async function(sprintId, devId, newCount) {
    const sprint = await Sprint.findById(sprintId);
    const developer = sprint.developers.id(devId);
    developer.count = newCount;
    sprint.save();
}

exports.deleteDeveloper = async function(sprintId, devId) {
    const sprint = await Sprint.findById(sprintId);
    const developer = sprint.developers.id(devId);
    developer.remove();
    sprint.save();
}

exports.deleteDeveloperQuery = async function(sprintId, devId) {
    await Sprint.findOneAndUpdate(
        {_id: sprintId},
        {$pull: {items: {_id: itemId}}}
    );
}

exports.resetSprintsSummary = async function() {
    const res = await SprintSummary.deleteMany({});
    console.log("Collection 'sprints summary': ", res.deletedCount);
    const snapshot = sprintsSummaryData.map(summary => {
        const pullRequests = summary.pullRequests.map(p => new PullRequest({developer: p.developer, count: p.count}));
        const sprint = new SprintSummary({sprint: summary.sprint, pullRequests: pullRequests}); 
        return sprint;
    });

    SprintSummary.insertMany(snapshot, err => {
        if (err) {
          console.error(err);
        } else {
          console.log('Successfully insert sprints summary: ', snapshot);
        }
      });
}