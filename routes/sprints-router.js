const express = require("express");
const sprintService = require('./../services/sprint-service');
const sprintSummaryService = require('./../services/sprint-summary-service');
const utils = require("./../utils/pull-requests");

const router = express.Router();

router.get("/", async (req, res) => { 
    const sprints = await sprintService.getSprints();
    const nextSprintNumber = sprints.reduce((s1, s2) => s1.number > s2.number ? s1.number : s2.number) + 1;
    console.log('nextSprintNumber=', nextSprintNumber);
    res.render('sprints', {sprints: sprints, nextSprintNumber: nextSprintNumber});  
    // sprintService.getSprints()
    //     .then(sprints => {
    //         console.log('sprints: ', sprints);
    //         res.render('sprints', {sprints: sprints});    
    //     });
});

router.post("/", async (req, res) => {
    const sprintName = req.body.sprintName;
    const sprintNumber = req.body.sprintNumber;
    const newSprint = await sprintService.createSprint(sprintName, sprintNumber);
    await sprintSummaryService.addSprint(newSprint);
    res.redirect('/sprints');     
});

router.get("/:sprintNumber", async (req, res) => {
    const sprintNumber = parseInt(req.params.sprintNumber);   
    console.log('sprints-route, GET: ', sprintNumber);

    const prevSprint = await sprintSummaryService.getSprintSummary(sprintNumber - 1);
    const currSprint = await sprintSummaryService.getSprintSummary(sprintNumber);

    //                     
    const prevSummary = prevSprint.pullRequests.sort((a, b) => -(a.count - b.count));
    const currSummary = currSprint.pullRequests.sort((a, b) => -(a.count - b.count));

    const sprintSummary = utils.getSummarySync(prevSummary, currSummary);
    const latestSprintNumber = await sprintService.getLatestSprintNumber();

    const prevSprintNumber = prevSprint.pullRequests.length !== 0 ? sprintNumber - 1 : null;
    const nextSprintNumber = latestSprintNumber.number !== sprintNumber ? sprintNumber + 1 : null;
    console.log('prevSprintNumber = ', prevSprintNumber, ' nextSprintNumber = ', nextSprintNumber);

    res.render('summary', {devs: sprintSummary, prevSprint: prevSprintNumber, nextSprint: nextSprintNumber}); 
});


module.exports = router;
