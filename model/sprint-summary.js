const mongoose = require("mongoose");
const prs = require("./pull-requests");
const pullRequestSchema = prs.pullRequestSchema;
const PullRequest = prs.PullRequest;

const sprintSummarySchema = new mongoose.Schema({ 
    sprint: {
        type: Number,
        minLength: 3,
        maxLength: 255,
        required: true
    },
    pullRequests: [pullRequestSchema]
  });

exports.sprintSummarySchema = sprintSummarySchema;
exports.SprintSummary = mongoose.model('SprintSummary', sprintSummarySchema);


exports.summary = [
    {
        sprint: 127,
        pullRequests: [
            {
                developer: "Konstantin Gromov",
                count:    131
            },
            {
                developer: "Ihor Bystrov",
                count:    229
            },
            {
                developer: "Eugene Turovskyy",
                count:    173
            },
            {
                developer: "Serhii Muslanov",
                count:    183
            },{
                developer: "Dmytro Annienkov",
                count:    188
            },
            {
                developer: "Myhkailo Mykhailyk",
                count:    123
            },
            {
                developer: "Oleksii Bulovzorov",
                count:    137
            }
        ]
    }, 
    {
        sprint: 128,
        pullRequests: [
            {
                developer: "Konstantin Gromov",
                count:    140
            },
            {
                developer: "Ihor Bystrov",
                count:    261
            },
            {
                developer: "Eugene Turovskyy",
                count:    181
            },
            {
                developer: "Serhii Muslanov",
                count:    188
            },{
                developer: "Dmytro Annienkov",
                count:    192
            },
            {
                developer: "Myhkailo Mykhailyk",
                count:    126
            },
            {
                developer: "Oleksii Bulovzorov",
                count:    140
            }
        ]
    },
    {
        sprint: 129,
        pullRequests: [
            {
                developer: "Konstantin Gromov",
                count:    144
            },
            {
                developer: "Ihor Bystrov",
                count:    266
            },
            {
                developer: "Eugene Turovskyy",
                count:    191
            },
            {
                developer: "Serhii Muslanov",
                count:    193
            },{
                developer: "Dmytro Annienkov",
                count:    195
            },
            {
                developer: "Myhkailo Mykhailyk",
                count:    130
            },
            {
                developer: "Oleksii Bulovzorov",
                count:    142
            }
        ]
    },
    {
        sprint: 130,
        pullRequests: [
            {
                developer: "Konstantin Gromov",
                count:    148
            },
            {
                developer: "Ihor Bystrov",
                count:    267
            },
            {
                developer: "Eugene Turovskyy",
                count:    205
            },
            {
                developer: "Serhii Muslanov",
                count:    193
            },{
                developer: "Dmytro Annienkov",
                count:    197
            },
            {
                developer: "Myhkailo Mykhailyk",
                count:    131
            },
            {
                developer: "Oleksii Bulovzorov",
                count:    143
            }
        ]
    },
    {
        sprint: 131,
        pullRequests: [
            {
                developer: "Konstantin Gromov",
                count:    156
            },
            {
                developer: "Ihor Bystrov",
                count:    276
            },
            {
                developer: "Eugene Turovskyy",
                count:    213
            },
            {
                developer: "Serhii Muslanov",
                count:    199
            },{
                developer: "Dmytro Annienkov",
                count:    201
            },
            {
                developer: "Myhkailo Mykhailyk",
                count:    133
            },
            {
                developer: "Oleksii Bulovzorov",
                count:    148
            }
        ]
    },
    {
        sprint: 132,
        pullRequests: [
            {
                developer: "Konstantin Gromov",
                count:    165
            },
            {
                developer: "Ihor Bystrov",
                count:    276
            },
            {
                developer: "Eugene Turovskyy",
                count:    217
            },
            {
                developer: "Serhii Muslanov",
                count:    207
            },{
                developer: "Dmytro Annienkov",
                count:    205
            },
            {
                developer: "Myhkailo Mykhailyk",
                count:    134
            },
            {
                developer: "Oleksii Bulovzorov",
                count:    150
            }
        ]
    }    
]