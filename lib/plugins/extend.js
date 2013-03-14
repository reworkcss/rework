/**
 * Module dependencies.
 */

var debug = require('debug')('rework:extend');
var utils = require('../utils');
var cleanRules = utils.cleanRules;
var escapeRegExp = utils.escapeRegExp;

/**
 * Add extension support.
 */

module.exports = function() {
  debug('use extend');
  return function(style, rework) {
    style.rules.forEach(function(rule, i) {
      var selectors = rule.selectors;
      if (!selectors) return;

      rule.declarations = rule.declarations.filter(function(decl) {
        var key = decl.property;
        var val = decl.value;
        if (!/^extends?$/.test(key)) return true;

        style.rules.slice(0, i).forEach(addSelectors(val, selectors));

        return false;
      });
    });

    removePlaceholders(style);
    cleanRules(style);
  };
};

/**
 * Returns a function that loops through `style.rules`
 * and adds the current `selectors` to rules that have
 * a selector that includes `val`.
 *
 * @param {String} val
 * @param {Array} selectors
 * @api private
 */

function addSelectors(val, selectors) {
  return function(rule) {
    if (!rule.selectors) return;

    var matchedSelectors = rule.selectors.filter(function (selector) {
      return ~selector.indexOf(val);
    });

    if (!matchedSelectors.length) return;

    selectors.forEach(function (selector) {
      matchedSelectors.forEach(function (matchedSelector) {
        rule.selectors.push(replaceSelector(matchedSelector, val, selector));
      });
    });
  };
};

/**
 * Replace all instances of `val`
 * in `matchedSelector` with `selector`.
 *
 * @param {String} matchedSelector
 * @param {String} val
 * @param {String} selector
 * @returns {String}
 * @api private
 */

function replaceSelector(matchedSelector, val, selector) {
  return matchedSelector.replace(new RegExp(escapeRegExp(val), 'g'), selector);
};

/*
 * Remove all rules that are not placeholders.
 *
 * @param {Object} style
 * @api private
 */

function removePlaceholders(style) {
  style.rules.forEach(function(rule) {
    if (!rule.selectors) return;

    rule.selectors = rule.selectors.filter(function(selector) {
      return '%' != selector[0];
    });
  });
};