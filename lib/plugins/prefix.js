
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

    style.rules.forEach(function(rule){
      if (rule.keyframes) return prefixKeyframes(props, vendors, rule);
      if (rule.declarations) prefix(props, vendors, rule.declarations);
    });
  }
};

/**
 * Prefix values within keyframes.
 *
 * @api private
 */

function prefixKeyframes(props, vendors, rule) {
  rule.keyframes.forEach(function(keyframe){
    if (!rule.vendor) return;
    prefix(props, vendors, keyframe.declarations, rule.vendor);
  });
}

/**
 * Prefix declarations.
 *
 * @api private
 */

function prefix(props, vendors, declarations, only) {
  for (var i = 0; i < props.length; ++i) {
    var prop = props[i];
    for (var j = 0, len = declarations.length; j < len; ++j) {
      var decl = declarations[j];
      var declValue = decl.value.match(prop) ? decl.value.match(prop).index===0 : null;
      if (prop != decl.property && !declValue) continue;

      // vendor prefixed props
      vendors.forEach(function(vendor){
        if (only && only != vendor) return;
        if(!declValue)
          declarations.push({
            property: vendor + decl.property,
            value: decl.value
          });
        else
          declarations.push({
            property: decl.property,
            value: vendor + decl.value
          })
      });

      // original prop
      declarations.push(decl);
      declarations.splice(j, 1);
    }
  }
}