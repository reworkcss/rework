
/**
 * Module dependencies.
 */

var utils = require('../utils')
  , visit = require('../visit');

/**
 * Define custom mixins.
 */

module.exports = function(mixins) {
  if (!mixins) throw new Error('mixins object required');
  return function(style, rework){
    visit.declarations(style, function(declarations){
      mixin(declarations, mixins);
    });
  }
};

/**
 * Visit declarations and apply mixins.
 *
 * @param {Array} declarations
 * @param {Object} mixins
 * @api private
 */

function mixin(declarations, mixins) {
  for (var i = 0; i < declarations.length; ++i) {
    var decl = declarations[i];
    var key = decl.property;
    var val = decl.value;
    var fn = mixins[key];
    if (!fn) continue;

    // invoke mixin
    var ret = fn(val);

    // apply properties
    for (var key in ret) {
      declarations.splice(i++, 0, {
        property: key,
        value: ret[key]
      });
    }

    // remove original
    declarations.splice(i, 1);
  }
}
