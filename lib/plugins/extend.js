/**
 * Module dependencies.
 */

var debug = require('debug')('rework:extend');

/**
 * Add extension support.
 */

module.exports = function() {
  debug('use extend');
  return function(style, rework) {
    var map = {};
    var rules = style.rules.length;

    for (var j = 0; j < rules; j++) {
      var rule = style.rules[j];
      if (!rule || !rule.selectors) return;

      // map selectors
      rule.selectors.forEach(function(sel, i) {
        map[sel] = rule;
        if ('%' == sel[0]) rule.selectors.splice(i, 1);
      });

      // visit extend: properties
      visit(rule, map);

      // clean up empty rules
      if (!rule.declarations.length) {
        style.rules.splice(j--, 1);
      }
    };
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

    var keys = Object.keys(map);
    keys.forEach(function(key) {
      if (0 != key.indexOf(val)) return;
      var extend = map[key];
      var suffix = key.replace(val, '');
      debug('extend %j with %j', rule.selectors, extend.selectors);
      extend.selectors = extend.selectors.concat(rule.selectors.map(function(sel) {
        return sel + suffix;
      }));
    });

    rule.declarations.splice(i--, 1);
  }
}
