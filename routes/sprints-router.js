const express = require("express");
// const mongoose = require("mongoose");
const schema = require(__dirname + "/../schema.js");
const utils = require(__dirname + "/../pull-requests.js");

const router = express.Router();

/* Schema */
const Developer = schema.Developer;
const Sprint = schema.Sprint;

router.get("/:sprintNumber", (req, res) => {
    const sprintNumber = req.params.sprintNumber;   
    console.log('sprints-route, GET: ', sprintNumber);

    // seems old version (4.0.*) does not support such query projection
    const findBySprintsWithProjection = {firstName: 1, lastName: 1, sprints: {$elemMatch: {number: {$gte: sprintNumber-1, $lte: sprintNumber}}}};
    Developer.find({"sprints.number": sprintNumber}, {firstName: 1, lastName: 1, sprints: {$elemMatch: {number: sprintNumber}}}, (err, devs) => {
        if (!err) {
            Developer.find({"sprints.number": sprintNumber-1},
                           {firstName: 1, lastName: 1, sprints: {$elemMatch: {number: sprintNumber-1}}}, 
                           (err, prevs) => {
                            const prevSummary = prevs.map(dev => {
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
                                const summary = {
                                    fullName: dev.firstName + ' ' + dev.lastName,
                                    count: sp1 ? sp1.total : 0
                                }
                                return summary;
                            })
                            .sort((a, b) => -(a.count - b.count))
                            .map((item, i, array) => {
                                const prevIndex = prevSummary.findIndex(dev => dev.fullName === item.fullName);
                                const prevState = prevSummary.find(dev => dev.fullName === item.fullName);
                                const prevCount = prevState ? prevState.count : 0;       
                                const minPRs = array[array.length-1].count;
                                if (i > 0 && i % groups === 0) {
                                    ++groupIndex;
                                }
                                console.log(item.fullName, ': prevCount: ', prevCount, ' currentCount=', item.count);
                                console.log(item.fullName, ': prevIndex: ', prevIndex, ' currentIndex=', i);
                                const devSummary = {
                                    ...item,                    
                                    position: i + 1,   
                                    diff: prevState ? '(+' + (item.count - prevCount) + ')' : '',     
                                    status: utils.getColorClass(groupIndex),
                                    icon: utils.getIcon(prevIndex === -1 ? 0 : prevIndex - i),
                                    width: Math.floor(item.count / minPRs * 1.5 * 300)                
                                }
                                console.log(devSummary);
                                return devSummary;
                            })
                res.render('index', {devs: sprintSummary}); 
            });
            
        } else {
            console.error(err);
        }  
    });
});

module.exports = router;