const express = require("express");
const developerService = require('./../services/developer-service');
const sprintService = require("./../services/sprint-service");
const sprintSummaryService = require('./../services/sprint-summary-service');
const router = express.Router();

router.get("/", async (req, res) => { 
    const developers = await developerService.getDevelopers();
    res.render('developers', {developers: developers});  
});

router.post("/", async (req, res) => {    
    const devName = req.body.name;
    const newDev = await developerService.createDeveloper(devName);
    // await sprintSummaryService.addDeveloper(newDev);
    // or 
    // Promise.all(developerService.createDeveloper(devName), 
    //             sprintSummaryService.addDeveloper(newDev))
    //         .then(() => res.redirect('/'));
    res.redirect('/'); 
});

router.get("/:developerId", async (req, res) => { 
    const developerId = req.params.developerId;   
    const developer = await developerService.getDeveloper(developerId);
    const devSprints = await sprintSummaryService.getDevSprintSummaries(developer.name);
    const sprints = devSprints.map(s => s.sprint);
    const prevCount = devSprints && devSprints.length > 0 ? devSprints[0].pullRequests.map(pr => pr.count) : 0;
    console.log(`sprints: ${sprints}, prevCount = ${prevCount}`);
    res.render('pullRequests', {developer: developer, sprints: sprints, prevCount: prevCount});  
});


router.post("/pullRequests", async (req, res) => { 
    const sprint = req.body.sprint;
    const devName = req.body.devName;
    const count = req.body.count;
    console.log(`sprint: ${sprint}, devName = ${devName}, count = ${count}`);
    await sprintSummaryService.updateDeveloper(sprint, devName, count);
    res.redirect('/developers'); 
});

module.exports = router;