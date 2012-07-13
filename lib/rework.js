
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
}

Stylesheet.prototype.prefix = function(prop, prefixes){
  this.prefixes.push({
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


Stylesheet.prototype.toString = function(){
  var self = this;
  var style = cssom.parse(this.str);

  style.cssRules = style.cssRules.map(function(rule){
    self.applyPrefixes(rule);
    return rule;
  });

  return style.toString();
};
