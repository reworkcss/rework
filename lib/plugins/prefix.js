
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
  return function(style, rework){
    vendors = vendors || rework.prefixes;

    style.rules.forEach(function(rule){
      if (rule.keyframes) return prefixKeyframes(prop, vendors, rule);
      if (rule.declarations) prefix(prop, vendors, rule.declarations);
    });
  }
};

/**
 * Prefix values within keyframes.
 *
 * @api private
 */

function prefixKeyframes(prop, vendors, rule) {
  rule.keyframes.forEach(function(keyframe){
    if (!rule.vendor) return;
    prefix(prop, vendors, keyframe.declarations, rule.vendor);
  });
}

/**
 * Prefix declarations.
 *
 * @api private
 */

function prefix(prop, vendors, declarations, only) {
  declarations.forEach(function(decl, i){
    if (prop != decl.property) return;

    // vendor prefixed props
    vendors.forEach(function(vendor){
      if (only && only != vendor) return;
      declarations.push({
        property: vendor + decl.property,
        value: decl.value
      });
    });

    // original prop
    declarations.push(decl);
    declarations.splice(i, 1);
  });
}