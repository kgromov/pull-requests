const fs = require("fs");

class Developer {
    constructor(firstName, lastName, count) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.count = count;
    }

    getName = function() {
        return this.firstName + ' ' + this.lastName;
    }
}

class Summary {
    constructor(position, status, fullName, currCount, prevCount) {
        this.position = position;
        this.status = status;
        this.fullName = fullName;
        this.currCount = currCount;
        this.diff = currCount - prevCount;
    }

    getIcon = function(prevPosition) {

    }
}

exports.loadDevelopers = function(sprintNumber, callback) {
    console.log('loadDevelopers: ', sprintNumber);
    const filePath = __dirname + `/resources/data/pr-summary-sprint-${sprintNumber}.json`;
    if (fs.existsSync(filePath)) {
        fs.readFile(filePath, 'utf8', function (err, data) {
            if (err) {
                console.log('Error: ' + err);
                callback([]);
            }
            const developers = JSON.parse(data);
            developers.sort((a, b) => -(a.count - b.count));
            // console.dir(developers);
            callback(developers);
        });
    }  
}

exports.getSummarySync = function(prevSummary, currentSummary) {
    const summaries = [];
    const groups = Math.floor(currentSummary.length / 3) + (currentSummary.length % 3 === 0 ? 0 : 1);
    let groupIndex = 0;
    const minPRs = currentSummary[currentSummary.length-1].count;
    let maxDiff = 0;
    for (let i = 0; i < currentSummary.length; i++) {
        let currState = currentSummary[i];
        const prevState = prevSummary.find(dev => dev.developer === currState.developer);
        const prevIndex = prevSummary.findIndex(dev => dev.developer === currState.developer);
        // console.log(currState);
        const diff = prevState ? '(+' + (currState.count - prevState.count) + ')' : '';
        const difference = prevState ? (currState.count - prevState.count) : -1;        
           
        if (i > 0 && i % groups === 0) {
            ++groupIndex;
        }


        if (difference > maxDiff) {
            maxDiff = difference;
        }
    
        summary = {
            position: i+1,
            fullName: currState.developer,
            count: currState.count,
            difference: difference,
            diff: diff,
            status: getColorClass(groupIndex),
            icon: getIcon(prevIndex === -1 ? 0 : prevIndex - i),
            // width: Math.floor(currState.count / minPRs * 1.5 * 300)
            width: Math.floor((currState.count / minPRs) * 50 + 300)
        };
        summaries.push(summary);       
    }   
     // set award
     console.log('maxDiff = ', maxDiff);
     summaries.filter(s => s.difference === maxDiff).forEach(s => s.hasAward = true); 
    return summaries;   
}

function getColorClass(groupIndex) {
    switch (groupIndex) {
        case 0:
            return 'leader';
        case 1:
            return 'average';
        case 2:
            return 'outsider';
    }
}

function getIcon(position) {
    if (position < 0) {
        return 'fas fa-arrow-down';
    } else if (position > 0) {
        return 'fas fa-arrow-up';
    } else {
        return 'fas fa-equals';
    }
}