
/**
 * Module dependencies.
 */

var visit = require('../visit')
  , utils = require('../utils');

/**
 * Define custom function.
 */

module.exports = function(functions) {
  if (!functions) throw new Error('functions object required');
  return function(style, rework){
    visit.declarations(style, function(declarations){
      for (var name in functions) {
        func(declarations, name, functions[name]);
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
 * @api private
 */

function func(declarations, name, func) {
  var regexp = new RegExp(escape(name) + '\\(([^\)]+)\\)', 'g');
  declarations.forEach(function(decl){
    if (!~decl.value.indexOf(name + '(')) return;
    decl.value = decl.value.replace(regexp, function(_, args){
      args = args.split(/,\s*/).map(utils.stripQuotes);
      return func.apply(decl, args);
    });
  });
}
