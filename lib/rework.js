
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

Stylesheet.prototype.toCSS =
Stylesheet.prototype.toString = function(){
  var self = this;
  var style = cssom.parse(this.str);

  style.cssRules = style.cssRules.map(function(rule){
    self.prefixes.forEach(function(prefix){
      var val = rule.style.getPropertyValue(prefix.prop);
      if (null == val) return;
      prefix.prefixes.forEach(function(str){
        rule.style.setProperty(str + prefix.prop, val);
      })
    });
    return rule;
  });

  return style.toString();
};
