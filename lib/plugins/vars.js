
/**
 * Module dependencies.
 */

var visit = require('../visit');

/**
 * Add variable support.
 *
 *   :root {
 *     var-header-color: #06c;
 *   }
 *
 *   h1 {
 *     background-color: var(header-color);
 *   }
 *
 * yields:
 *
 *   h1 {
 *     background-color: #06c;
 *   }
 *
 */

module.exports = function(map) {
  map = map || {};

  function replace(str) {
    return str.replace(/\bvar\((.*?)\)/g, function(_, name){
      var val = map[name];
      if (!val) throw new Error('variable "' + name + '" is undefined');
      if (val.match(/\bvar\(/)) val = replace(val);
      return val;
    });
  }

  return function vars(style){
    visit.declarations(style, function(declarations, node){
      // map vars
      declarations.forEach(function(decl){
        if (0 != decl.property.indexOf('var-')) return;
        var name = decl.property.replace('var-', '');
        map[name] = decl.value;
      });

      // substitute values
      declarations.forEach(function(decl){
        if (!decl.value.match(/\bvar\(/)) return;
        decl.value = replace(decl.value);
      });
    });
  }
};
