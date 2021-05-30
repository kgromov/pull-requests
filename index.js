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

function initData() {
    $(document).ready(function(){
        $.ajaxSetup({
            async: false
        });
        const prevSummary = loadDevelopers(127); 
        const currentSummary = loadDevelopers(128);
        initDOM(prevSummary, currentSummary);
    });  
}

function loadDevelopers(sprintNumber) {
    const developers = [];   
    $.getJSON( `data/pr-summary-sprint-${sprintNumber}.json`, function( data ) {
        $.each( data, function(i, dev) {  
            developers.push(dev);                      
        });
    });
    developers.sort((a, b) => -(a.count - b.count));
    return developers;
}

function initDOM(prevSummary, currentSummary) {

    const devsContainer = $('.container');

    let currIndex = 0;
    const groups = Math.floor(currentSummary.length / 3) + (currentSummary.length % 3 === 0 ? 0 : 1);
    let groupIndex = 0;
    const minPRs = currentSummary[currentSummary.length-1].count;
    currentSummary.forEach(currState => {
        const prevState = prevSummary.find(dev => dev.lastName === currState.lastName);
        const prevIndex = prevSummary.findIndex(dev => dev.lastName === currState.lastName);
        console.log(currState);
        const diff = prevState ? '(+' + (currState.count - prevState.count) + ')' : '';
       
        if (currIndex > 0 && currIndex % groups === 0) {
            ++groupIndex;
        }
        ++currIndex;
        // let value = currState.firstName + ' ' + currState.lastName + ' = ' + currState.count;    
        devsContainer.append('<div></div>');
        const dev = $('.container div:nth-child(' + currIndex +')');

        console.log('currIndex = ', currIndex, ' prevIndex = ', prevIndex);
        dev.addClass(getColorClass(groupIndex)); /*.css('width', Math.floor(currState.count / minPRs * 300));*/
        dev.prepend(getIcon(prevIndex === -1 ? 0 : prevIndex - currIndex));
        $('.container div:nth-child(' + currIndex +') i')
            .after('<p>'+ currState.firstName + ' ' + currState.lastName 
            +': <p>'+currState.count + '<em>' + diff + '</em></p>' +': </p>');
    });    
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

/* <i class="fas fa-arrow-down"></i> */
/* <i class="fas fa-arrow-up"></i> */
/* <i class="fas fa-equals"></i> */
function getIcon(position) {
    if (position < 0) {
        return '<i class="fas fa-arrow-down"></i>';
    } else if (position > 0) {
        return '<i class="fas fa-arrow-up"></i>';
    } else {
        return '<i class="fas fa-equals"></i>';
    }
}


