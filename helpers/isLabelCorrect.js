
const isLabelCorrect = ( value, rest ) => {

    if ( Object.keys(value).length !== 3 ) return false;

    if ( !value.hasOwnProperty('min') ) return false;
    if ( !value.hasOwnProperty('ok') ) return false;
    if ( !value.hasOwnProperty('ideal') ) return false;

    return true;

}

module.exports = {
    isLabelCorrect
}
