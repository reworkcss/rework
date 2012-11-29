
/**
 * Prefix `value`.
 *
 *    button {
 *      transition: height, transform 2s, width 0.3s linear;
 *    }
 *
 * yields:
 *
 *    button {
 *      -webkit-transition: height, -webkit-transform 2s, width 0.3s linear;
 *      -moz-transition: height, -moz-transform 2s, width 0.3s linear;
 *      transition: height, transform 2s, width 0.3s linear
 *    }
 *
 */

module.exports = function(value, vendors) {
  return function(style, rework){
    vendors = vendors || rework.prefixes;

    style.rules.forEach(function(rule){
      if (!rule.declarations) return;
      var decl;

      for (var i = 0; i < rule.declarations.length; ++i) {
        decl = rule.declarations[i];
        if (!~decl.value.indexOf(value)) continue;

        // ignore vendor-prefixed properties
        if ('-' == decl.property[0]) continue;

        // ignore vendor-prefixed values
        if (~decl.value.indexOf('-' + value)) continue;
        
        // vendor prefixed props
        vendors.forEach(function(vendor){
          var prop = 'transition' == decl.property
            ? vendor + decl.property
            : decl.property;

          rule.declarations.splice(i++, 0, {
            property: prop,
            value: decl.value.replace(value, vendor + value)
          });
        });
      }
    });
  }
};