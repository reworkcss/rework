
/**
 * Module dependencies.
 */

var css = require('css');
var convertSourceMap = require('convert-source-map');
var parse = css.parse;
var stringify = css.stringify;

/**
 * Expose `Rework`.
 */

exports = module.exports = Rework;

/**
 * Initialize a new stylesheet `Rework` with `obj`.
 *
 * @param {Object|String} obj
 * @param {Object} options
 * @return {Rework}
 * @api public
 */

function Rework(obj, options) {
  if (!(this instanceof Rework)) return new Rework(obj, options);
  if ('string' == typeof obj) obj = parse(obj, options);
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
 * Stringify the stylesheet.
 *
 * @param {Object} options
 * @return {String}
 * @api public
 */

Rework.prototype.toString = function(options){
  options = options || {};
  var result = stringify(this.obj, options);
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
  var content = convertSourceMap.fromObject(map).toBase64();
  return '/*# sourceMappingURL=data:application/json;base64,' + content + ' */';
}
