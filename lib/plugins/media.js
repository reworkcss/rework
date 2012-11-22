
/**
 * Module dependencies.
 */

var utils = require('../utils');

/**
 * Define custom media types.
 *
 *   @media iphone {
 *
 *   }
 *
 * TODO: boundary regexps
 */

module.exports = function(obj) {
  var keys = Object.keys(obj);
  return function(style, rework){
    style.rules.forEach(function(rule){
      if (!rule.media) return;
      var i = keys.indexOf(rule.media);
      if (-1 == i) return;
      var key = keys[i];
      var val = obj[key];
      rule.media = rule.media.replace(key, val);
    });
  }
};