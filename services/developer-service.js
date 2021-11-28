const mongoose = require("mongoose")
const devModule = require("./../model/developer");
const PullRequest = require("./../model/pull-requests").PullRequest;

const Developer = devModule.Developer;
const developersData = devModule.developers;

exports.getDevelopers = async function() {
    try {
        const developers = await Developer.find({}).sort({name: 1});
        console.log(`developers: ${developers}`);
        return developers;
    } catch(e) {
        throw new Error(e);
    }    
}

exports.getDeveloper = async function(developerId) {
    return await Developer.findById(developerId);
}

exports.createDeveloper = async function(name) {
    const newDev = new Developer({name: name});
    const result = await newDev.save();
    console.log(`New dev ${result} created`);
}

exports.deleteDeveloper = async function(developerId) {
    await Developer.findByIdAndDelete(developerId);
}

exports.resetDevelopers = async function() {
    const res = await Developer.deleteMany({});
    console.log("Collection 'developers': ", res.deletedCount);
    const snapshot = developersData.map(dev => new Developer({name: dev.name}));

    Developer.insertMany(snapshot, err => {
        if (err) {
          console.error(err);
        } else {
          console.log('Successfully insert developers: ', snapshot);
        }
      });
}

