
/**
 * Module dependencies.
 */

var debug = require('debug')('rework:extend');

/**
 * Add extension support.
 */

module.exports = function() {
  debug('use extend');
  return function(style, rework){
    var map = {};
    style.rules.forEach(function(rule){
      if (!rule.declarations) return;
      rule.selectors.forEach(function(selector){
        map[selector] = rule;
      });
      visit(rule, map);
    });
  }
};

/**
 * Visit declarations and extensions.
 *
 * @param {Object} rule
 * @param {Object} map
 * @api private
 */

function visit(rule, map) {
  for (var i = 0; i < rule.declarations.length; ++i) {
    var decl = rule.declarations[i];
    var key = decl.property;
    var val = decl.value;
    if (!/^extends?$/.test(key)) continue;
    
    var extend = map[val];
    if (!extend) throw new Error('failed to extend "' + val + '"');
    
    debug('extend %j with %j', rule.selectors, extend.selectors);
    extend.selectors = extend.selectors.concat(rule.selectors);
    rule.declarations.splice(i--, 1);
  }
}