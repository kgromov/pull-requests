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

        // const devsContainer = $('.container');
        // for(let i=0; i<currentSummary.length; i++) {            
        //     devsContainer.append('<div id=\"' +i+ '\"></div>');
        // }
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

  
    const groups = Math.floor(currentSummary.length / 3) + (currentSummary.length % 3 === 0 ? 0 : 1);
    let groupIndex = 0;
    const minPRs = currentSummary[currentSummary.length-1].count;
    for (let i = 0; i < currentSummary.length; i++) {
        let currState = currentSummary[i];
        const prevState = prevSummary.find(dev => dev.lastName === currState.lastName);
        const prevIndex = prevSummary.findIndex(dev => dev.lastName === currState.lastName);
        console.log(currState);
        const diff = prevState ? '(+' + (currState.count - prevState.count) + ')' : '';
       
        if (i > 0 && i % groups === 0) {
            ++groupIndex;
        }
         
        devsContainer.append('<div id=\"' +i+ '\"></div>');   
        const dev = $('.container #'+i).addClass('progressbar');  
        console.log('currIndex = ', i, ' prevIndex = ', prevIndex, ', dev: ', dev.attr('id'));

        dev.addClass(getColorClass(groupIndex)).css('width', Math.floor(currState.count / minPRs * 1.5 * 300));
        dev.prepend(getIcon(prevIndex === -1 ? 0 : prevIndex - i));
        dev.find('i')
            .after('<p>'+ currState.firstName + ' ' + currState.lastName +': </p>');
        dev.append('<p class=\"diff\">' +currState.count + '<em>' + diff + '</em></p>' );
        dev.prepend('<span>'+ (i+1) +'</span>');
    }   
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


