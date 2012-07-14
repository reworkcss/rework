
/**
 * Module dependencies.
 */

var cssom = require('cssom');

/**
 * Expose `rework`.
 */

module.exports = rework;

/**
 * Rework the given string of css.
 *
 * @param {String} css
 * @return {Stylesheet}
 * @api public
 */

function rework(css) {
  return new Stylesheet(css);
}

/**
 * Initialize a new `Stylesheet` with the given `css`.
 *
 * @param {String} css
 * @api private
 */

function Stylesheet(css) {
  this.str = css;
  this.prefixes = [];
  this.selectorMapFunctions = [];
  this.keyframePrefixes = null;
}

/**
 * Apply `prefixes` to occurrences of `prop`.
 *
 * @param {String} prop
 * @param {Array} prefixes
 * @return {Stylesheet}
 * @api public
 */

Stylesheet.prototype.prefix = function(prop, prefixes){
  if ('@keyframes' == prop) return this.prefixKeyframes(prefixes);
  this.prefixes.push({
    prop: prop,
    vendors: prefixes
  });
  return this;
};

/**
 * Apply `prefixes` to occurrences of `@keyframes`.
 *
 * @param {String} prop
 * @param {Array} prefixes
 * @return {Stylesheet}
 * @api private
 */

Stylesheet.prototype.prefixKeyframes = function(prefixes){
  this.keyframePrefixes = prefixes;
  return this;
};

/**
 * Apply the given map `fn` to selectors.
 *
 * @param {Function} fn
 * @return {Stylesheet}
 * @api public
 */

Stylesheet.prototype.mapSelectors = function(fn){
  this.selectorMapFunctions.push(fn);
  return this;
};

/**
 * Apply `prefixes` to the given `rule`.
 *
 * Options:
 *
 *  - `only` the given vendor prefix
 *
 * @param {Object} rule
 * @param {Object} options
 * @api private
 */

Stylesheet.prototype.applyPrefixes = function(rule, options){
  var self = this;
  options = options || {};
  var only = options.only;
  self.prefixes.forEach(function(prefix){
    if (!rule.style) return;
    var val = rule.style.getPropertyValue(prefix.prop);
    if ('' == val) return;
    prefix.vendors.forEach(function(vendor){
      if (only && vendor != only) return;
      rule.style.setProperty(vendor + prefix.prop, val);
    });
  });
};

/**
 * Apply keyframes `prefixes` to the given `style`.
 *
 * @param {Object} style
 * @api private
 */

Stylesheet.prototype.applyKeyframePrefixes = function(style){
  var self = this;
  var prefixes = this.keyframePrefixes;
  if (!prefixes) return;
  style.cssRules.forEach(function(rule, i){
    if (8 != rule.type) return;
    prefixes.forEach(function(vendor){
      // keyframes
      // TODO: better clone...
      var clone = cssom.parse(rule.cssText).cssRules[0];
      clone._vendorPrefix = vendor;

      // prefix properties
      clone.cssRules = clone.cssRules.map(function(rule){
        self.applyPrefixes(rule, { only: vendor });
        return rule;
      });

      style.insertRule(clone.cssText, i + 1);
    });
  });
};

/**
 * Apply selector map functions to `rule`.
 *
 * @param {Object} rule
 * @api private
 */

Stylesheet.prototype.applySelectorMapFunctions = function(rule){
  this.selectorMapFunctions.forEach(function(fn){
    rule.selectorText = fn(rule.selectorText);
  });
};

/**
 * Transform and return the css.
 *
 * @return {String}
 * @api public
 */

Stylesheet.prototype.toString = function(){
  var self = this;
  var style = cssom.parse(this.str);

  this.applyKeyframePrefixes(style);
  style.cssRules = style.cssRules.map(function(rule){
    self.applyPrefixes(rule);
    self.applySelectorMapFunctions(rule);
    return rule;
  });

  return style.toString();
};
