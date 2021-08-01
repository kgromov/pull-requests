const mongoose = require("mongoose");

const sprintSchema = new mongoose.Schema({ 
    number: {
        type: 'number',
        required: true
    },
    total:  {
        type: 'number',
        required: true
    }
  });
  
  const developerSchema = new mongoose.Schema({ 
    firstName: 'string', 
    lastName: 'string', 
    sprints: [sprintSchema]
  });

exports.Sprint = mongoose.model('Sprint', sprintSchema);
exports.Developer = mongoose.model('Developer', developerSchema);