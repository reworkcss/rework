
/**
 * Strip `str` quotes.
 *
 * @param {String} str
 * @return {String}
 * @api private
 */

exports.stripQuotes = function(str) {
  if ('"' == str[0] || "'" == str[0]) return str.slice(1, -1);
  return str;
};

/**
 * Remove rules with an empty selector array
 * or empty declarations array.
 *
 * @param {Object} style
 * @return {Object} style
 * @api private
 */

exports.cleanRules = function(style) {
  return style.rules = style.rules.filter(function(rule) {
    return !rule.selectors
      || (rule.selectors.length && rule.declarations.length);
  })
};

/**
 * Escape a string for use with a RegExp.
 * http://stackoverflow.com/a/6969486/927092
 *
 * @param {String} str
 * @return {String}
 * @api private
 */

exports.escapeRegExp = function(str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}