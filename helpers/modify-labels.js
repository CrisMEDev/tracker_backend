
const modifyLabels = ( labelsArray = [], days = [], labels = [] ) => {

    days.forEach( (day, index) => {
        
        labelsArray[ day - 1 ] = labels[ index ];
        
    });

    return labelsArray;
    
}

module.exports = {
    modifyLabels
}