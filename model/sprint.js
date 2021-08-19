const mongoose = require("mongoose");

const sprintSchema = new mongoose.Schema({ 
    name: {
        type: String,
        minLength: 3,
        maxLength: 255,
        required: true
    },
    number: {
        type: Number,
        required: true
    },
    goal: String
  });

exports.sprintSchema = sprintSchema;
exports.Sprint = mongoose.model('Sprint', sprintSchema);

exports.sprints = [
    {
        name: 'S127 UA',
        number: 127        
    },
    {
        name: 'S128 UA',
        number: 128        
    },
    {
        name: 'S129 UA',
        number: 129        
    },
    {
        name: 'S130 UA',
        number: 130        
    },
    {
        name: 'S131 UA',
        number: 131        
    },
    {
        name: 'S132 UA',
        number: 132        
    }  
]