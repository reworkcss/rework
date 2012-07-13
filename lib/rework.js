
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
  this.keyframePrefixes = [];
}

Stylesheet.prototype.prefix = function(prop, prefixes){
  if ('@keyframes' == prop) return this.prefixKeyframes(prop, prefixes);
  this.prefixes.push({
    prop: prop,
    prefixes: prefixes
  });
  return this;
};

Stylesheet.prototype.prefixKeyframes = function(prop, prefixes){
  this.keyframePrefixes.push({
    prop: prop,
    prefixes: prefixes
  });
  return this;
};

Stylesheet.prototype.applyPrefixes = function(rule){
  var self = this;
  self.prefixes.forEach(function(prefix){
    var val = rule.style.getPropertyValue(prefix.prop);
    if (null == val) return;
    prefix.prefixes.forEach(function(str){
      rule.style.setProperty(str + prefix.prop, val);
    });
  });
};

Stylesheet.prototype.applyKeyframePrefixes = function(style){
  
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
