const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const sprintsRouter = require("./routes/sprints-router");
const developersRouter = require("./routes/developers-router");
const sprintService = require("./services/sprint-service");
const developerService = require("./services/developer-service");
const sprintSummaryService = require("./services/sprint-summary-service");

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("resources"));
app.use("/sprints", sprintsRouter);
app.use("/developers", developersRouter);

/* Mongoose */
const localUrl = 'mongodb://localhost:27017/pull-requests';
const dbUser = 'admin';
const dbPassword = '';
const clusterUrl = `mongodb+srv://${dbUser}:${dbPassword}@cluster0.kxhtq.mongodb.net/pull-requests`;

// establish connection
mongoose.connect(clusterUrl, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => console.log('Sucessfully connected to MongoDB...'))
    .catch(e => console.error('Failed connected to MongoDB...', e));

/* Populate with existed data */
// sprintService.resetSprints();
// sprintSummaryService.resetSprintsSummary();
// developerService.resetDevelopers();

app.get("/", (req, res) => { 
    res.render('home'); 
});

app.listen(9000, () => {
    console.log("Server is started on post 9000");
});

