
/**
 * Add variable support.
 * 
 * 
 * yields:
 * 
 * 
 */

module.exports = function() {
  var map = {};

  function replace(str) {
    return str.replace(/\bvar\((.*?)\)/g, function(_, name){
      var val = map[name];
      if (val.match(/\bvar\(/)) val = replace(val);
      return val;
    });
  }

  return function(style){
    // map variables
    style.rules.forEach(function(rule){
      if (!rule.declarations) return;
      rule.declarations.forEach(function(decl, i){
        if (0 != decl.property.indexOf('var-')) return;
        var name = decl.property.replace('var-', '');
        map[name] = decl.value;
      });
    });

    // substitute values
    style.rules.forEach(function(rule){
      if (!rule.declarations) return;
      rule.declarations.forEach(function(decl, i){
        if (!decl.value.match(/\bvar\(/)) return;
        decl.value = replace(decl.value);
      });
    });
  }
};