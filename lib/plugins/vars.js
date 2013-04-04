
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
  var map = map || {};

  function replace(str) {
    return str.replace(/\bvar\((.*?)\)/g, function(_, name){
      var val = map[name];
      if (val.match(/\bvar\(/)) val = replace(val);
      return val;
    });
  }

  return function vars(style){
    visit.declarations(style, function(declarations, node){
      for (var i = 0; i < declarations.length; i++) {
        var decl = declarations[i];
        var property = decl.property;
        var value = decl.value;

        // map vars
        if (0 == property.indexOf('var-')) {
          var name = property.replace('var-', '');
          map[name] = value;
          declarations.splice(i--, 1);
        } else if (value.match(/\bvar\(/)) { // substitute values
          decl.value = replace(value);
        }
      }
    });
  }
};
