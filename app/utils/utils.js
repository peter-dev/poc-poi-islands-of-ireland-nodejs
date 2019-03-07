'use strict';

const Utils = {
  // helper method to make the string capitalized, uppercase its first letter, lowercase the rest of the string
  // https://flaviocopes.com/how-to-uppercase-first-letter-javascript/
  capitalize: function(word) {
    if (typeof word !== 'string') return '';
    return word.charAt(0).toUpperCase() + word.toLowerCase().slice(1);
  }
};

module.exports = Utils;
