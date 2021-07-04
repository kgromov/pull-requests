const express = require("express");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { window } = new JSDOM();
const { document } = (new JSDOM('')).window;
global.document = document;
const $ = require("jquery")(window);

// const utils = require(__dirname + "/resources/index.js");


const app = express();
// app.set("view engine", "ejs");
app.use(express.static("resources"));

app.get("/", (req, res) => {
    const sprintNumber = 1
    $.getJSON('https://jsonplaceholder.typicode.com/todos/1', 
    function(data) {
         console.log(data);
        res.sendFile(__dirname + "/index.html");
    });        
});

app.listen(9000, () => {
    console.log("Server is started on post 9000");
});


async function loadDevelopers(sprintNumber) {
    $.ajaxSetup({
        async: false
    });
    const developers = []; 
    $.getJSON(__dirname + `/resources/data/pr-summary-sprint-${sprintNumber}.json`, 
    function(data) {
        $.each(data, function(i, dev) {  
            developers.push(dev);    
        });
    });
    return developers;
}


