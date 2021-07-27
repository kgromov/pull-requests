const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

// const jsdom = require("jsdom");
// const { JSDOM } = jsdom;
// const { window } = new JSDOM();
// const { document } = (new JSDOM('')).window;
// global.document = document;
// const $ = require("jquery")(window);

const utils = require(__dirname + "/pull-requests.js");

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("resources"));

/* Mongoose */
const localUrl = 'mongodb://localhost:27017/pullRequests';

const dbUser = 'admin';
const dbPassword = '';
const clusterUrl = `mongodb+srv://${dbUser}:${dbPassword}@cluster0.kxhtq.mongodb.net/pullRequests`;

mongoose.connect(clusterUrl, {useNewUrlParser: true, useUnifiedTopology: true});

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

const Sprint = mongoose.model('Sprint', sprintSchema);
const Developer = mongoose.model('Developer', developerSchema);

/* Populate with existed data */
const developers = [
    {
        firstName: "Konstantin",
        lastName: "Gromov",
        sprints: [
                {number: 127, total: 131}, 
                {number: 128, total: 140},  
                {number: 129, total: 144}, 
                {number: 130, total: 148},
                {number: 131, total: 156}
            ]
    },
    {
        firstName: "Ihor",
        lastName: "Bystrov",
        sprints: [
            {number: 127, total: 229}, 
            {number: 128, total: 236},  
            {number: 129, total: 241}, 
            {number: 130, total: 242},
            {number: 131, total: 251}
        ]
    },
    {
        firstName: "Eugene",
        lastName: "Turovskyy",
        sprints: [
            {number: 127, total: 173}, 
            {number: 128, total: 181},  
            {number: 129, total: 191}, 
            {number: 130, total: 205},
            {number: 131, total: 213}
        ]
    },
    {
        firstName: "Serhii",
        lastName: "Muslanov",
        sprints: [
            {number: 127, total: 183}, 
            {number: 128, total: 188},  
            {number: 129, total: 193}, 
            {number: 130, total: 193},
            {number: 131, total: 199}
        ]
    },{
        firstName: "Dmytro",
        lastName: "Annenkov",
        sprints: [
            {number: 127, total: 188}, 
            {number: 128, total: 192},  
            {number: 129, total: 195}, 
            {number: 130, total: 197},
            {number: 131, total: 201}
        ]
    },
    {
        firstName: "Myhkailo",
        lastName: "Mykhailyk",
        sprints: [
            {number: 127, total: 123}, 
            {number: 128, total: 126},  
            {number: 129, total: 130}, 
            {number: 130, total: 131},
            {number: 131, total: 133}
        ]
    },
    {
        firstName: "Oleksii",
        lastName: "Bilovzorov",
        sprints: [
            {number: 127, total: 137}, 
            {number: 128, total: 140},  
            {number: 129, total: 142}, 
            {number: 130, total: 143},
            {number: 131, total: 148}
        ]
    }
]

const snapshot = developers.map(item => {
    const sprints = item.sprints.map(s => new Sprint({number: s.number, total: s.total}));
    const dev = new Developer({firstName: item.firstName, lastName: item.lastName, sprints: sprints});    
    return dev;
});

// Developer.insertMany(snapshot, err => {
//   if (err) {
//     console.error(err);
//   } else {
//     console.log('Successfully insert developers: ', snapshot);
//   }
// });
  
/* Routers */
app.get("/", (req, res) => {
    res.render('index', {devs: []}); 
});

app.post("/", (req, res) => {
    const sprintNumber = req.body.sprintNumber;
    console.log('app.js, post: ', sprintNumber);
    res.redirect(`/sprints/${sprintNumber}`);  
   
});

app.get("/sprints/:sprintNumber", (req, res) => {
    const sprintNumber = req.params.sprintNumber;   
    console.log('app.js, get: ', sprintNumber);

    // seems old version (4.0.*) does not support such query projection
    // try with 2 queries, then update mongod server
    const query1 = {"sprints": {$elemMatch: {number: {$gte: sprintNumber-1, $lte: sprintNumber}}}};
    Developer.find({}, {firstName: 1, lastName: 1, sprints: {$elemMatch: {number: {$gte: sprintNumber-1, $lte: sprintNumber}}}}, (err, devs) => {
        if (!err) {
            // better to create another model - summary and save into it
            const prevSummary = devs.map(dev => {
                const sp1 = dev.sprints[0];
                const summary = {
                    fullName: dev.firstName + ' ' + dev.lastName,
                    count: sp1 ? sp1.total : 0
                }
                return summary;
            })
            .sort((a, b) => -(a.count - b.count));

            let groupIndex = 0;
            const groups = Math.floor(devs.length / 3) + (devs.length % 3 === 0 ? 0 : 1);
   
            const sprintSummary = devs.map(dev => {
                const sp1 = dev.sprints[0];
                const sp2 = dev.sprints[1];
                const summary = {
                    fullName: dev.firstName + ' ' + dev.lastName,
                    count: Math.max(sp1 ? sp1.total : 0, sp2 ? sp2.total : 0),
                    diff: Math.abs((sp1 ? sp1.total : 0) - (sp2 ? sp2.total : 0))
                //     count: Math.max(dev.sprints[1]?.total || 0, dev.sprints[0]?.total || 0),
                //     diff:  Math.abs(dev.sprints[1]?.total || 0 - dev.sprints[0]?.total || 0)
                }
                return summary;
            })
            .sort((a, b) => -(a.count - b.count))
            .map((item, i, array) => {
                const prevIndex = prevSummary.findIndex(dev => dev.fullName === item.fullName);
                const prevState = prevSummary.find(dev => dev.fullName === item.fullName);       
                const minPRs = array[array.length-1].count;
                if (i > 0 && i % groups === 0) {
                    ++groupIndex;
                }
                console.log(item.fullName, ': prevCount: ', prevState ? prevState.count : 0, ' currentCount=', item.count);
                console.log(item.fullName, ': prevIndex: ', prevIndex, ' currentIndex=', i);
                const devSummary = {
                    ...item,                    
                    position: i + 1,   
                    diff: prevState ? '(+' + (item.count - prevState.count) + ')' : '',     
                    status: utils.getColorClass(groupIndex),
                    icon: utils.getIcon(prevIndex === -1 ? 0 : prevIndex - i),
                    width: Math.floor(item.count / minPRs * 1.5 * 300)                
                }
                // console.log(devSummary);
                return devSummary;
            })
            res.render('index', {devs: sprintSummary}); 
        } else {
            console.error(err);
        }
    });

    // utils.loadDevelopers(sprintNumber, (currentSummary) => {
    //     utils.loadDevelopers(sprintNumber -1, (prevSummary) => {
    //         console.log('currentSummary: ', currentSummary);
    //         console.log('prevSummary: ', prevSummary);
    //         const summary = utils.getSummarySync(prevSummary, currentSummary);
    //         res.render('index', {devs: summary}); 
    //     });
    // });    
});

app.listen(9000, () => {
    console.log("Server is started on post 9000");
});

