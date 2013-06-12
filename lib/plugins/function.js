
/**
 * Module dependencies.
 */

var visit = require('../visit');
var utils = require('../utils');
var strip = utils.stripQuotes;

/**
 * Define custom function.
 */

module.exports = function(functions, args) {
  if (!functions) throw new Error('functions object required');
  return function(style, rework){
    visit.declarations(style, function(declarations){
      for (var name in functions) {
        func(declarations, name, functions[name], args);
      }
    });
  }
};

/**
 * Escape regexp codes in string.
 *
 * @param {String} s
 * @api private
 */

function escape(s) {
  return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}

/**
 * Visit declarations and apply functions.
 *
 * @param {Array} declarations
 * @param {Object} functions
 * @param {Boolean} [parseArgs]
 * @api private
 */

function func(declarations, name, func, parseArgs) {
  if (false !== parseArgs) parseArgs = true;
  var regexp = new RegExp(escape(name) + '\\(([^\)]+)\\)', 'g');
  declarations.forEach(function(decl){
    if ('comment' == decl.type) return;
    if (!~decl.value.indexOf(name + '(')) return;
    decl.value = decl.value.replace(regexp, function(_, args){
      if (!parseArgs) return func.call(decl, strip(args));
      args = args.split(/,\s*/).map(strip);
      return func.apply(decl, args);
    });
  });
}
