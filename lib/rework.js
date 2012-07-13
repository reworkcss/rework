
/**
 * Module dependencies.
 */

var cssom = require('cssom');

module.exports = rework;

function rework(str) {
  return new Stylesheet(str);
}

function Stylesheet(str) {
  this.str = str;
  this.prefixes = [];
  this.keyframePrefixes = null;
}

Stylesheet.prototype.prefix = function(prop, prefixes){
  if ('@keyframes' == prop) return this.prefixKeyframes(prefixes);
  this.prefixes.push({
    prop: prop,
    vendors: prefixes
  });
  return this;
};

Stylesheet.prototype.prefixKeyframes = function(prefixes){
  this.keyframePrefixes = prefixes;
  return this;
};

Stylesheet.prototype.applyPrefixes = function(rule, options){
  var self = this;
  options = options || {};
  var only = options.only;
  self.prefixes.forEach(function(prefix){
    var val = rule.style.getPropertyValue(prefix.prop);
    if (null == val) return;
    prefix.vendors.forEach(function(vendor){
      if (only && vendor != only) return;
      rule.style.setProperty(vendor + prefix.prop, val);
    });
  });
};

Stylesheet.prototype.applyKeyframePrefixes = function(style){
  var self = this;
  var prefixes = this.keyframePrefixes;
  if (!prefixes) return;
  style.cssRules.forEach(function(rule, i){
    if (8 != rule.type) return;
    prefixes.forEach(function(prefix){
      // properties
      rule.cssRules = rule.cssRules.map(function(rule){
        self.applyPrefixes(rule, { only: prefix });
        return rule;
      });

      // keyframes
      // TODO: better clone...
      var clone = cssom.parse(rule.cssText).cssRules[0];
      clone._vendorPrefix = prefix;
      // TODO: wtf: "fromopacity: 0;"
      style.insertRule(clone.cssText, i + 1);
    });
  });
};

Stylesheet.prototype.toString = function(){
  var self = this;
  var style = cssom.parse(this.str);

  this.applyKeyframePrefixes(style);
  style.cssRules = style.cssRules.map(function(rule){
    self.applyPrefixes(rule);
    return rule;
  });

  return style.toString();
};
