const mongoose = require("mongoose")
const Developer = require("./../model/developer").Developer;
const PullRequest = require("./../model/pull-requests").PullRequest;
const Sprint = require("./../model/sprint").Sprint;
const SprintSummary = require("./../model/sprint-summary").SprintSummary;
const sprintsData = require("./../model/sprint").sprints;
const sprintsSummaryData = require("./../model/sprint-summary").summary;

exports.getSprints = async function() {
    try {
        const sprints = await Sprint.find({}).sort({number: 1});
        console.log(`sprints: ${sprints}`);
        return sprints;
    } catch(e) {
        throw new Error(e);
    }    
}

exports.getSprintById = async function(sprintId) {
    return await Sprint.findById(sprintId);
} 


exports.createSprint = async function(sprintName, sprintNumber) {
    const sprint = new Sprint({
        name: sprintName,
        number: sprintNumber
    });
    const result = await sprint.save();
    console.log(`New sprint ${result} created`);
}

exports.deleteSprint = async function(sprintId) {
    await Sprint.findByIdAndDelete(listId);
    // const sprint = await Sprint.findById(listId);
    // sprint.remove();
}

// =========== summary ==============
exports.getSprintSummary = async function(sprintNumber) {
    const result = await SprintSummary.findOne({sprint: sprintNumber})
            .sort({"pullRequests.count": -1});
    console.log(`sprint ${sprintNumber} summary: ${result}`);
    return result;
} 

exports.addDeveloper = async function(sprintNumber, developerName, count) {
    const sprint = await getSprintSummary(sprintNumber);
    const newDeveloper = new PullRequest({
        developer: developerName,
        count: count
    });
    sprint.pullRequests.push(newDeveloper);
    return await sprint.save();
}

exports.updateDeveloper = async function(sprintId, devId, newCount) {
    const sprint = await SprintSummary.updateOne(
        {_id: sprintId, "pullRequests._id": devId},
        {
            $set: {
                "pullRequests.$.count": newCount
             }
        }
    );
    console.log(sprint);
    return sprint;
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

exports.resetSprints = async function() {
    const res = await Sprint.deleteMany({});
    console.log("Collection 'sprints': ", res.deletedCount);
    const snapshot = sprintsData.map(sprint => new Sprint({name: sprint.name, number: sprint.number}));

    Sprint.insertMany(snapshot, err => {
        if (err) {
          console.error(err);
        } else {
          console.log('Successfully insert sprints: ', snapshot);
        }
      });
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

// exports.resetData = async function() {
//     const res = await Sprint.deleteMany({});
//     console.log("Collection 'sprints': ", res.deletedCount);
//     const snapshot = data.map(item => {
//         const developers = item.developers.map(d => new Developer({name: d.name, count: d.count}));
//         const sprint = new Sprint({number: item.number, developers: developers});    
//         return sprint;
//     });

//     Sprint.insertMany(snapshot, err => {
//         if (err) {
//           console.error(err);
//         } else {
//           console.log('Successfully insert sprints: ', snapshot);
//         }
//       });
// }
