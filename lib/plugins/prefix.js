
/**
 * Module dependencies.
 */

var visit = require('../visit');

/**
 * Prefix `prop`.
 *
 *   .button {
 *     border-radius: 5px;
 *   }
 *
 * yields:
 *
 *   .button {
 *     -webkit-border-radius: 5px;
 *     -moz-border-radius: 5px;
 *     border-radius: 5px;
 *   }
 *
 */

module.exports = function(prop, vendors) {
  var props = Array.isArray(prop)
    ? prop
    : [prop];

  return function(style, rework){
    vendors = vendors || rework.prefixes;
    visit.declarations(style, function(declarations, node){
      var only = node.vendor;
      var isKeyframes = !! node.keyframes;

      for (var i = 0; i < props.length; ++i) {
        var prop = props[i];

        for (var j = 0, len = declarations.length; j < len; ++j) {
          var decl = declarations[j];
          if ('comment' == decl.type) continue;
          if (prop != decl.property) continue;

          // vendor prefixed props
          for (var k = 0; k < vendors.length; ++k) {
            if (!only && isKeyframes) continue;
            if (only && only != vendors[k]) continue;
            declarations.push({
              type: 'declaration',
              property: vendors[k] + decl.property,
              value: decl.value
            });
          }

          // original prop
          declarations.push(decl);
          declarations.splice(j, 1);
        }
      }
    });
  }
};
