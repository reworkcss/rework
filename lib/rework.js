
/**
 * Module dependencies.
 */

var css = require('css');

/**
 * Expose `rework`.
 */

exports = module.exports = rework;

/**
 * Expose `visit` helpers.
 */

exports.visit = require('./visit');

/**
 * Expose prefix properties.
 */

exports.properties = require('./properties');

/**
 * Initialize a new stylesheet `Rework` with `str`.
 *
 * @param {String} str
 * @return {Rework}
 * @api public
 */

function rework(str) {
  return new Rework(css.parse(str));
}

/**
 * Initialize a new stylesheet `Rework` with `obj`.
 *
 * @param {Object} obj
 * @api private
 */

function Rework(obj) {
  this.obj = obj;
}

/**
 * Use the given plugin `fn(style, rework)`.
 *
 * @param {Function} fn
 * @return {Rework}
 * @api public
 */

Rework.prototype.use = function(fn){
  fn(this.obj.stylesheet, this);
  return this;
};

/**
 * Specify global vendor `prefixes`,
 * explicit ones may still be passed
 * to most plugins.
 *
 * @param {Array} prefixes
 * @return {Rework}
 * @api public
 */

Rework.prototype.vendors = function(prefixes){
  this.prefixes = prefixes;
  return this;
};

/**
 * Stringify the stylesheet.
 *
 * @param {Object} options
 * @return {String}
 * @api public
 */

Rework.prototype.toString = function(options){
  return css.stringify(this.obj, options);
};

/**
 * Expose plugins.
 */

exports.media = require('./plugins/media');
exports.mixin = exports.mixins = require('./plugins/mixin');
exports.prefix = require('./plugins/prefix');
exports.colors = require('./plugins/colors');
exports.extend = require('./plugins/extend');
exports.references = require('./plugins/references');
exports.prefixValue = require('./plugins/prefix-value');
exports.prefixSelectors = require('./plugins/prefix-selectors');
exports.keyframes = require('./plugins/keyframes');
exports.opacity = require('./plugins/opacity');
exports.at2x = require('./plugins/at2x');
exports.url = require('./plugins/url');
exports.ease = require('./plugins/ease');
exports.vars = require('./plugins/vars');
exports.import = require('./plugins/import');
