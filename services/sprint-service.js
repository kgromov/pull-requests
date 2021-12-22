const mongoose = require("mongoose")
const Sprint = require("./../model/sprint").Sprint;
const sprintsData = require("./../model/sprint").sprints;


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

exports.getLatestSprintNumber = async function() {
    return await Sprint.findOne({}, {number: 1, _id: 0}).sort({number: -1});
}

exports.createSprint = async function(sprintName, sprintNumber) {
    const sprint = new Sprint({
        name: sprintName,
        number: sprintNumber
    });
    const result = await sprint.save();
    console.log(`New sprint ${result} created`);
    return sprint;
}

exports.deleteSprint = async function(sprintId) {
    await Sprint.findByIdAndDelete(sprintId);
    // const sprint = await Sprint.findById(sprintId);
    // sprint.remove();
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
