
/**
 * Module dependencies.
 */

var utils = require('../utils');

/**
 * Map `url()` calls.
 * 
 *   body {
 *     background: url(/images/bg.png);
 *   }
 * 
 * yields:
 * 
 *   body {
 *     background: url(http://example.com/images/bg.png);
 *   }
 * 
 */

module.exports = function(fn) {
  return function(style, rework){
    rules(style.rules, fn);
  }
};

/**
 * Visit `rules`.
 *
 * @param {Array} rules
 * @param {Function} fn
 * @api private
 */

function rules(arr, fn) {
  arr.forEach(function(rule){
    if (rule.rules) rules(rule.rules, fn);
    if (rule.declarations) url(rule, fn);
  });
}

/**
 * Map url().
 *
 * @api private
 */

function url(rule, fn) {
  rule.declarations = rule.declarations.map(function(decl, i){
    if (!~decl.value.indexOf('url(')) return decl;
    decl.value = decl.value.replace(/url\(([^)]+)\)/g, function(_, url){
      url = utils.stripQuotes(url);
      return 'url("' + fn(url) + '")';
    });
    return decl;
  });
}