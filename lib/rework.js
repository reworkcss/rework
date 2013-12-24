
/**
 * Module dependencies.
 */

var css = require('css');

/**
 * Expose `Rework`.
 */

exports = module.exports = Rework;

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
 * Initialize a new stylesheet `Rework` with `str` and `options`.
 *
 * @param {String} str
 * @param {Object} options
 * @api public
 */

function Rework(str, options) {
  if (!(this instanceof Rework)) return new Rework(str, options);
  options = options || {};
  options.position = true; // we need this for sourcemaps
  this.options = options;
  this.source = str;
  this.obj = css.parse(str, options);
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
 * Create a useful error from a parsed `dec` and `msg`.
 *
 * @param {Object} dec
 * @param {String} msg
 * @return {Error}
 */

Rework.prototype.error = function (dec, msg) {
  var pos = dec.position;
  if (!pos) return new Error(msg);

  var lines = this.source.split('\n');
  var s = pos.start;
  var e = pos.end;
  var sourceStart = Math.max(0, s.line - 1);
  var beforeStart = Math.max(0, s.line - 3);

  var err = new Error(msg + ' near line ' + s.line + ':' + s.column);
  err.start = s;
  err.end = e;
  err.source = lines.slice(sourceStart, e.line).join('\n');
  err.context = {
    before: lines.slice(beforeStart, sourceStart).join('\n'),
    after: lines.slice(e.line, e.line + 2).join('\n')
  };

  return err;
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
