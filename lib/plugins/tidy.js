/**
 * Module dependencies.
 */

var debug = require('debug')('rework:tidy');

/**
 * Add extension support.
 */

module.exports = function() {
  debug('use tidy');
  return function(style, rework){
    var i = style.rules.length;
    for (i; i--;) {
        var rule = style.rules[i];
        if (!rule.declarations.length) {
            debug("Deleting rule:", rule);
            style.rules.splice(i, 1);
        }
    };
  }
};

