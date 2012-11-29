
/**
 * Module dependencies.
 */

var parse = require('color-parser');

/**
 * Provide color manipulation helpers:
 *
 *    button {
 *      background: rgba(#eee, .5)
 *    }
 *
 * yields:
 *
 *    button {
 *      background: rgba(238, 238, 238, .5)
 *    }
 *
 */

module.exports = function() {
  return function(style, rework){
    style.rules.forEach(function(rule){
      if (!rule.declarations) return;
      substitute(rule.declarations);
    });
  }
};

/**
 * Substitute easing functions.
 *
 * @api private
 */

function substitute(declarations) {
  for (var i = 0, len = declarations.length; i < len; ++i) {
    var decl = declarations[i];
    var val = decl.value;
    var i = val.indexOf('rgba');
    if (-1 == i) continue;

    // grab rgba(...) value
    var rgba = val.slice(i, val.indexOf(')', i));

    // color
    var c = rgba.slice(rgba.indexOf('(') + 1, rgba.indexOf(',')).trim();
    c = parse(c);

    // alpha
    var a = rgba.slice(rgba.indexOf(',') + 1, rgba.length);
    a = parseFloat(a);

    // format
    c = 'rgba('
      + c.r
      + ','
      + c.g
      + ','
      + c.b
      + ','
      + a
      + ')';

    // replace
    decl.value = val.replace(rgba + ')', c);
  }
}