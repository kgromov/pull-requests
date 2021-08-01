const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const data = require(__dirname + "/data.js").developers;
const schema = require(__dirname + "/schema.js");
const sprints = require(__dirname + "/routes/sprints-router.js");

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("resources"));
app.use("/sprints", sprints);

/* Mongoose */
const localUrl = 'mongodb://localhost:27017/pull-requests';
const dbUser = 'admin';
const dbPassword = '';
const clusterUrl = `mongodb+srv://${dbUser}:${dbPassword}@cluster0.kxhtq.mongodb.net/pull-requests`;
/* Schema */
const Developer = schema.Developer;
const Sprint = schema.Sprint;

// establish connection
mongoose.connect(localUrl, {useNewUrlParser: true, useUnifiedTopology: true});

/* Populate with existed data */
// resetData();

async function resetData() {
    const res = await Developer.deleteMany({});
    console.log("Collection 'developers': ", res.deletedCount);
    const snapshot = data.map(item => {
        const sprints = item.sprints.map(s => new Sprint({number: s.number, total: s.total}));
        const dev = new Developer({firstName: item.firstName, lastName: item.lastName, sprints: sprints});    
        return dev;
    });

    Developer.insertMany(snapshot, err => {
        if (err) {
          console.error(err);
        } else {
          console.log('Successfully insert developers: ', snapshot);
        }
      });
}
  
/* Routers */
app.get("/", (req, res) => {
    res.render('index', {devs: []}); 
});

app.post("/", (req, res) => {
    const sprintNumber = req.body.sprintNumber;
    console.log('app.js, post: ', sprintNumber);
    res.redirect(`/sprints/${sprintNumber}`);  
   
});

app.listen(9000, () => {
    console.log("Server is started on post 9000");
});

