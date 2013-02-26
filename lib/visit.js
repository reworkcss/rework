
exports.declarations = function(node, fn){
  node.rules.forEach(function(rule){
    // @media etc
    if (rule.rules) {
      exports.declarations(rule, fn);
      return;
    }

    // keyframes
    if (rule.keyframes) {
      rule.keyframes.forEach(function(keyframe){
        fn(keyframe.declarations, rule);
      });
      return;
    }

    fn(rule.declarations, node);
  });
};


// /**
//  * Prefix `prop`.
//  *
//  *   .button {
//  *     border-radius: 5px;
//  *   }
//  *
//  * yields:
//  *
//  *   .button {
//  *     -webkit-border-radius: 5px;
//  *     -moz-border-radius: 5px;
//  *     border-radius: 5px;
//  *   }
//  *
//  */

// module.exports = function(prop, vendors) {
//   var props = Array.isArray(prop)
//     ? prop
//     : [prop];

//   return function visit(style, rework){
//     vendors = vendors || rework.prefixes;


//   }
// };

// /**
//  * Prefix values within keyframes.
//  *
//  * @api private
//  */

// function prefixKeyframes(props, vendors, rule) {
//   rule.keyframes.forEach(function(keyframe){
//     if (!rule.vendor) return;
//     prefix(props, vendors, keyframe.declarations, rule.vendor);
//   });
// }

// /**
//  * Prefix declarations.
//  *
//  * @api private
//  */

// function prefix(props, vendors, declarations, only) {
//   for (var i = 0; i < props.length; ++i) {
//     var prop = props[i];
//     for (var j = 0, len = declarations.length; j < len; ++j) {
//       var decl = declarations[j];
//       if (prop != decl.property) continue;

//       // vendor prefixed props
//       vendors.forEach(function(vendor){
//         if (only && only != vendor) return;
//         declarations.push({
//           property: vendor + decl.property,
//           value: decl.value
//         });
//       });

//       // original prop
//       declarations.push(decl);
//       declarations.splice(j, 1);
//     }
//   }
// }
