
/**
 * Module dependencies.
 */

var visit = require('../visit');

/**
 * Provide property reference support.
 *
 *    button {
 *      width: 50px;
 *      height: @width;
 *      line-height: @height;
 *    }
 *
 * yields:
 *
 *    button {
 *      width: 50px;
*      height: 50px;
*      line-height: 50px;
 *    }
 *
 */

module.exports = function() {
  return function(style, rework){
    visit.declarations(style, substitute);
  }
};

/**
 * Substitute easing functions.
 *
 * @api private
 */

function substitute(declarations) {
  var map = {};

  for (var i = 0, len = declarations.length; i < len; ++i) {
    var decl = declarations[i];
    var key = decl.property;
    var val = decl.value;

    decl.value = val.replace(/(^| )@([-\w]+)/g, function(_, p, name){
      if (null == map[name]) throw new Error('@' + name + ' is not defined in this scope');
      return p + map[name];
    });

    map[key] = decl.value;
  }
}
