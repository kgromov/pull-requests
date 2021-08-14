const mongoose = require("mongoose");

const pullRequestSchema = new mongoose.Schema({ 
    developer: {
        type: String,
        min: 0,
        max: 999
    },
    count:  {
        type: Number,
        min: 0,
        max: 9999
    }
  });

exports.pullRequestSchema = pullRequestSchema;
exports.PullRequest = mongoose.model('PullRequests', pullRequestSchema);