const mongoose = require("mongoose");

const developerSchema = new mongoose.Schema({ 
    name: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 255
    }, 
  });

exports.developerSchema = developerSchema;
exports.Developer = mongoose.model('Developer', developerSchema);

exports.developers = [
    {
        name: "Konstantin Gromov"
    },
    {
        name: "Ihor Bystrov",
    },
    {
        name: "Eugene Turovskyy",
    },
    {
        name: "Serhii Muslanov",
    },
    {
        name: "Dmytro Annienkov",
    },
    {
        name: "Myhkailo Mykhailyk",
    },
    {
        name: "Oleksii Bilovzorov",
    },
    {
        name: "Viacheslav Cheban",
    }
]

exports.pullRequests = [
    {
        name: "Konstantin Gromov",
        sprints: [
            {sprint: 127, count: 131}, 
            {sprint: 128, count: 140},  
            {sprint: 129, count: 144}, 
            {sprint: 130, count: 148},
            {sprint: 131, count: 156},
            {sprint: 132, count: 165}
        ]
    },
    {
        name: "Ihor Bystrov",
        sprints: [
            {sprint: 127, count: 254}, 
            {sprint: 128, count: 261},  
            {sprint: 129, count: 266}, 
            {sprint: 130, count: 267},
            {sprint: 131, count: 276},
            {sprint: 132, count: 276}
        ]
    },
    {
        name: "Eugene Turovskyy",
        sprints: [
            {sprint: 127, count: 173}, 
            {sprint: 128, count: 181},  
            {sprint: 129, count: 191}, 
            {sprint: 130, count: 205},
            {sprint: 131, count: 213},
            {sprint: 132, count: 217}
        ]
    },
    {
        name: "Serhii Muslanov",
        sprints: [
            {sprint: 127, count: 183}, 
            {sprint: 128, count: 188},  
            {sprint: 129, count: 193}, 
            {sprint: 130, count: 193},
            {sprint: 131, count: 199},
            {sprint: 132, count: 207}
        ]
    },
    {
        name: "Dmytro Annienkov",
        sprints: [
            {sprint: 127, count: 188}, 
            {sprint: 128, count: 192},  
            {sprint: 129, count: 195}, 
            {sprint: 130, count: 197},
            {sprint: 131, count: 201},
            {sprint: 132, count: 205}
        ]
    },
    {
        name: "Myhkailo Mykhailyk",
        sprints: [
            {sprint: 127, count: 123}, 
            {sprint: 128, count: 126},  
            {sprint: 129, count: 130}, 
            {sprint: 130, count: 131},
            {sprint: 131, count: 133},
            {sprint: 132, count: 134}
        ]
    },
    {
        name: "Oleksii Bilovzorov",
        sprints: [
            {sprint: 127, count: 137}, 
            {sprint: 128, count: 140},  
            {sprint: 129, count: 142}, 
            {sprint: 130, count: 143},
            {sprint: 131, count: 148},
            {sprint: 132, count: 150}
        ]
    }
];