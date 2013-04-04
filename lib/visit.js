
/**
 * Visit `node`'s declarations recursively and
 * invoke `fn(declarations, node)`.
 *
 * @param {Object} node
 * @param {Function} fn
 * @api private
 */

exports.declarations = function(node, fn) {
  var rules = node.rules;

  for (var i = 0; i < rules.length; i++) {
    var rule = rules[i];

    // @media etc
    if (rule.rules) {
      exports.declarations(rule, fn);
      if (!rule.rules.length) rules.splice(i--, 1);
      continue;
    }

    // keyframes
    var keyframes = rule.keyframes
    if (keyframes) {
      for (var j = 0; j < keyframes.length; j++) {
        var decls = keyframes[j].declarations;
        fn(decls, rule);
        if (!decls.length) keyframes.splice(j--, 1);
      }
      if (!keyframes.length) rules.splice(i--, 1);
      continue;
    }

    // @charset, @import etc
    var declarations = rule.declarations
    if (!declarations) continue;

    fn(declarations, node);
    if (!declarations.length) rules.splice(i--, 1);
  }
}