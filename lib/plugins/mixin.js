
/**
 * Module dependencies.
 */

var utils = require('../utils');
var visit = require('../visit');

/**
 * Define custom mixins.
 */

module.exports = function(mixins) {
  if (!mixins) throw new Error('mixins object required');
  return function(style, rework){
    visit.declarations(style, function(declarations){
      mixin(rework, declarations, mixins);
    });
  }
};

/**
 * Visit declarations and apply mixins.
 *
 * @param {Rework} rework
 * @param {Array} declarations
 * @param {Object} mixins
 * @api private
 */

function mixin(rework, declarations, mixins) {
  for (var i = 0; i < declarations.length; ++i) {
    var decl = declarations[i];
    if ('comment' == decl.type) continue;

    var key = decl.property;
    var val = decl.value;
    var fn = mixins[key];
    if (!fn) continue;

    // invoke mixin
    var ret = fn.call(rework, val);

    // apply properties
    for (var key in ret) {
      var val = ret[key];
      if (Array.isArray(val)) {
        val.forEach(function(val){
          declarations.splice(i++, 0, {
            type: 'declaration',
            property: key,
            value: val
          });
        });
      } else {
        declarations.splice(i++, 0, {
          type: 'declaration',
          property: key,
          value: val
        });
      }
    }

    // remove original
    declarations.splice(i--, 1);
  }
}
