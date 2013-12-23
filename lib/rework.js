
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

exports.__defineGetter__('properties', function () {
  console.warn('rework.properties has been removed.');
  return [];
})

/**
 * Initialize a new stylesheet `Rework` with `str`.
 *
 * @param {String} str
 * @param {Object} options
 * @return {Rework}
 * @api public
 */

function rework(str, options) {
  options = options || {};
  options.position = true; // we need this for sourcemaps
  return new Rework(css.parse(str, options));
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
 * Deprecated as of https://github.com/visionmedia/rework/issues/126.
 *
 * @param {Array} prefixes
 * @return {Rework}
 * @api public
 */

Rework.prototype.vendors = function(prefixes){
  console.warn('rework.vendors() is deprecated. Please see: https://github.com/visionmedia/rework/issues/126.');
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
  options = options || {};
  var result = css.stringify(this.obj, options);
  if (options.sourcemap && !options.sourcemapAsObject) {
    result = result.code + '\n' + sourcemapToComment(result.map);
  }
  return result;
};

/**
 * Convert sourcemap to base64-encoded comment
 *
 * @param {Object} map
 * @return {String}
 * @api private
 */

function sourcemapToComment(map) {
  var convertSourceMap = require('convert-source-map');
  var content = convertSourceMap.fromObject(map).toBase64();
  return '/*# sourceMappingURL=data:application/json;base64,' + content + ' */';
}

/**
 * Expose plugins.
 */

exports.mixin = exports.mixins = require('./plugins/mixin');
exports.function = exports.functions = require('./plugins/function');
exports.colors = require('./plugins/colors');
exports.extend = require('rework-inherit');
exports.references = require('./plugins/references');
exports.prefixSelectors = require('./plugins/prefix-selectors');
exports.at2x = require('./plugins/at2x');
exports.url = require('./plugins/url');
exports.ease = require('./plugins/ease');

/**
 * Warn if users try to use removed components.
 * This will be removed in v1.
 */

[
  'vars',
  'keyframes',
  'prefix',
  'prefixValue',
].forEach(function (plugin) {
  exports[plugin] = function () {
    console.warn('rework.' + plugin + '() has been removed from rework core. Please view https://github.com/visionmedia/rework or https://github.com/visionmedia/rework/wiki/Plugins-and-Utilities.');
    return noop;
  };
});

/**
 * Try/catch plugins unavailable in component.
 */

 try {
  exports.inline = require('./plugins/inline');
} catch (err) {}

function noop(){}
