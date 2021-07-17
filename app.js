const express = require("express");
const bodyParser = require("body-parser");
// const fs = require("fs");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { window } = new JSDOM();
const { document } = (new JSDOM('')).window;
global.document = document;
const $ = require("jquery")(window);

const utils = require(__dirname + "/pull-requests.js");

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("resources"));

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
    utils.loadDevelopers(sprintNumber, (currentSummary) => {
        utils.loadDevelopers(sprintNumber -1, (prevSummary) => {
            console.log('currentSummary: ', currentSummary);
            console.log('prevSummary: ', prevSummary);
            const summary = utils.getSummarySync(prevSummary, currentSummary);
            res.render('index', {devs: summary}); 
        });
    });    
});

app.listen(9000, () => {
    console.log("Server is started on post 9000");
});

