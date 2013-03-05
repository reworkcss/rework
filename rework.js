;(function(){


/**
 * hasOwnProperty.
 */

var has = Object.prototype.hasOwnProperty;

/**
 * Require the given path.
 *
 * @param {String} path
 * @return {Object} exports
 * @api public
 */

function require(path, parent, orig) {
  var resolved = require.resolve(path);

  // lookup failed
  if (null == resolved) {
    orig = orig || path;
    parent = parent || 'root';
    var err = new Error('Failed to require "' + orig + '" from "' + parent + '"');
    err.path = orig;
    err.parent = parent;
    err.require = true;
    throw err;
  }

  var module = require.modules[resolved];

  // perform real require()
  // by invoking the module's
  // registered function
  if (!module.exports) {
    module.exports = {};
    module.client = module.component = true;
    module.call(this, module.exports, require.relative(resolved), module);
  }

  return module.exports;
}

/**
 * Registered modules.
 */

require.modules = {};

/**
 * Registered aliases.
 */

require.aliases = {};

/**
 * Resolve `path`.
 *
 * Lookup:
 *
 *   - PATH/index.js
 *   - PATH.js
 *   - PATH
 *
 * @param {String} path
 * @return {String} path or null
 * @api private
 */

require.resolve = function(path) {
  if (path.charAt(0) === '/') path = path.slice(1);
  var index = path + '/index.js';

  var paths = [
    path,
    path + '.js',
    path + '.json',
    path + '/index.js',
    path + '/index.json'
  ];

  for (var i = 0; i < paths.length; i++) {
    var path = paths[i];
    if (has.call(require.modules, path)) return path;
  }

  if (has.call(require.aliases, index)) {
    return require.aliases[index];
  }
};

/**
 * Normalize `path` relative to the current path.
 *
 * @param {String} curr
 * @param {String} path
 * @return {String}
 * @api private
 */

require.normalize = function(curr, path) {
  var segs = [];

  if ('.' != path.charAt(0)) return path;

  curr = curr.split('/');
  path = path.split('/');

  for (var i = 0; i < path.length; ++i) {
    if ('..' == path[i]) {
      curr.pop();
    } else if ('.' != path[i] && '' != path[i]) {
      segs.push(path[i]);
    }
  }

  return curr.concat(segs).join('/');
};

/**
 * Register module at `path` with callback `definition`.
 *
 * @param {String} path
 * @param {Function} definition
 * @api private
 */

require.register = function(path, definition) {
  require.modules[path] = definition;
};

/**
 * Alias a module definition.
 *
 * @param {String} from
 * @param {String} to
 * @api private
 */

require.alias = function(from, to) {
  if (!has.call(require.modules, from)) {
    throw new Error('Failed to alias "' + from + '", it does not exist');
  }
  require.aliases[to] = from;
};

/**
 * Return a require function relative to the `parent` path.
 *
 * @param {String} parent
 * @return {Function}
 * @api private
 */

require.relative = function(parent) {
  var p = require.normalize(parent, '..');

  /**
   * lastIndexOf helper.
   */

  function lastIndexOf(arr, obj) {
    var i = arr.length;
    while (i--) {
      if (arr[i] === obj) return i;
    }
    return -1;
  }

  /**
   * The relative require() itself.
   */

  function localRequire(path) {
    var resolved = localRequire.resolve(path);
    return require(resolved, parent, path);
  }

  /**
   * Resolve relative to the parent.
   */

  localRequire.resolve = function(path) {
    var c = path.charAt(0);
    if ('/' == c) return path.slice(1);
    if ('.' == c) return require.normalize(p, path);

    // resolve deps by returning
    // the dep in the nearest "deps"
    // directory
    var segs = parent.split('/');
    var i = lastIndexOf(segs, 'deps') + 1;
    if (!i) i = 0;
    path = segs.slice(0, i + 1).join('/') + '/deps/' + path;
    return path;
  };

  /**
   * Check if module is defined at `path`.
   */

  localRequire.exists = function(path) {
    return has.call(require.modules, localRequire.resolve(path));
  };

  return localRequire;
};
require.register("visionmedia-css-parse/index.js", function(exports, require, module){

module.exports = function(css){

  /**
   * Parse stylesheet.
   */

  function stylesheet() {
    return { stylesheet: { rules: rules() }};
  }

  /**
   * Opening brace.
   */

  function open() {
    return match(/^{\s*/);
  }

  /**
   * Closing brace.
   */

  function close() {
    return match(/^}\s*/);
  }

  /**
   * Parse ruleset.
   */

  function rules() {
    var node;
    var rules = [];
    whitespace();
    comments();
    while (css[0] != '}' && (node = atrule() || rule())) {
      comments();
      rules.push(node);
    }
    return rules;
  }

  /**
   * Match `re` and return captures.
   */

  function match(re) {
    var m = re.exec(css);
    if (!m) return;
    css = css.slice(m[0].length);
    return m;
  }

  /**
   * Parse whitespace.
   */

  function whitespace() {
    match(/^\s*/);
  }

  /**
   * Parse comments;
   */

  function comments() {
    while (comment()) ;
  }

  /**
   * Parse comment.
   */

  function comment() {
    if ('/' == css[0] && '*' == css[1]) {
      var i = 2;
      while ('*' != css[i] || '/' != css[i + 1]) ++i;
      i += 2;
      css = css.slice(i);
      whitespace();
      return true;
    }
  }

  /**
   * Parse selector.
   */

  function selector() {
    var m = match(/^([^{]+)/);
    if (!m) return;
    return m[0].trim().split(/\s*,\s*/);
  }

  /**
   * Parse declaration.
   */

  function declaration() {
    // prop
    var prop = match(/^(\*?[-\w]+)\s*/);
    if (!prop) return;
    prop = prop[0];

    // :
    if (!match(/^:\s*/)) return;

    // val
    var val = match(/^((?:'(?:\\'|.)*?'|"(?:\\"|.)*?"|\([^\)]*?\)|[^};])+)\s*/);
    if (!val) return;
    val = val[0].trim();

    // ;
    match(/^[;\s]*/);

    return { property: prop, value: val };
  }

  /**
   * Parse keyframe.
   */

  function keyframe() {
    var m;
    var vals = [];

    while (m = match(/^(from|to|\d+%|\.\d+%|\d+\.\d+%)\s*/)) {
      vals.push(m[1]);
      match(/^,\s*/);
    }

    if (!vals.length) return;

    return {
      values: vals,
      declarations: declarations()
    };
  }

  /**
   * Parse keyframes.
   */

  function keyframes() {
    var m = match(/^@([-\w]+)?keyframes */);
    if (!m) return;
    var vendor = m[1];

    // identifier
    var m = match(/^([-\w]+)\s*/);
    if (!m) return;
    var name = m[1];

    if (!open()) return;
    comments();

    var frame;
    var frames = [];
    while (frame = keyframe()) {
      frames.push(frame);
      comments();
    }

    if (!close()) return;

    return {
      name: name,
      vendor: vendor,
      keyframes: frames
    };
  }

  /**
   * Parse media.
   */

  function media() {
    var m = match(/^@media *([^{]+)/);
    if (!m) return;
    var media = m[1].trim();

    if (!open()) return;
    comments();

    var style = rules();

    if (!close()) return;

    return { media: media, rules: style };
  }

  /**
   * Parse import
   */

  function atimport() {
    return _atrule('import')
  }

  /**
   * Parse charset
   */

  function atcharset() {
    return _atrule('charset');
  }

  /**
   * Parse non-block at-rules
   */

  function _atrule(name) {
    var m = match(new RegExp('^@' + name + ' *([^;\\n]+);\\s*'));
    if (!m) return;
    var ret = {}
    ret[name] = m[1].trim();
    return ret;
  }

  /**
   * Parse declarations.
   */

  function declarations() {
    var decls = [];

    if (!open()) return;
    comments();

    // declarations
    var decl;
    while (decl = declaration()) {
      decls.push(decl);
      comments();
    }

    if (!close()) return;
    return decls;
  }

  /**
   * Parse at rule.
   */

  function atrule() {
    return keyframes()
      || media()
      || atimport()
      || atcharset();
  }

  /**
   * Parse rule.
   */

  function rule() {
    var sel = selector();
    if (!sel) return;
    comments();
    return { selectors: sel, declarations: declarations() };
  }

  return stylesheet();
};

});
require.register("visionmedia-css-stringify/index.js", function(exports, require, module){

/**
 * Stringfy the given AST `node`.
 *
 * @param {Object} node
 * @param {Object} options
 * @return {String}
 * @api public
 */

module.exports = function(node, options){
  return new Compiler(options).compile(node);
};

/**
 * Initialize a new `Compiler`.
 */

function Compiler(options) {
  options = options || {};
  this.compress = options.compress;
  this.indentation = options.indent;
}

/**
 * Compile `node`.
 */

Compiler.prototype.compile = function(node){
  return node.stylesheet.rules.map(this.visit, this)
    .join(this.compress ? '' : '\n\n');
};

/**
 * Visit `node`.
 */

Compiler.prototype.visit = function(node){
  if (node.charset) return this.charset(node);
  if (node.keyframes) return this.keyframes(node);
  if (node.media) return this.media(node);
  if (node.import) return this.import(node);
  return this.rule(node);
};

/**
 * Visit import node.
 */

Compiler.prototype.import = function(node){
  return '@import ' + node.import + ';';
};

/**
 * Visit media node.
 */

Compiler.prototype.media = function(node){
  if (this.compress) {
    return '@media '
      + node.media
      + '{'
      + node.rules.map(this.visit, this).join('')
      + '}';
  }

  return '@media '
    + node.media
    + ' {\n'
    + this.indent(1)
    + node.rules.map(this.visit, this).join('\n\n')
    + this.indent(-1)
    + '\n}';
};

/**
 * Visit charset node.
 */

Compiler.prototype.charset = function(node){
  if (this.compress) {
    return '@charset ' + node.charset + ';';
  }

  return '@charset ' + node.charset + ';\n';
};

/**
 * Visit keyframes node.
 */

Compiler.prototype.keyframes = function(node){
  if (this.compress) {
    return '@'
      + (node.vendor || '')
      + 'keyframes '
      + node.name
      + '{'
      + node.keyframes.map(this.keyframe, this).join('')
      + '}';
  }

  return '@'
    + (node.vendor || '')
    + 'keyframes '
    + node.name
    + ' {\n'
    + this.indent(1)
    + node.keyframes.map(this.keyframe, this).join('\n')
    + this.indent(-1)
    + '}';
};

/**
 * Visit keyframe node.
 */

Compiler.prototype.keyframe = function(node){
  if (this.compress) {
    return node.values.join(',')
      + '{'
      + node.declarations.map(this.declaration, this).join(';')
      + '}';
  }

  return this.indent()
    + node.values.join(', ')
    + ' {\n'
    + this.indent(1)
    + node.declarations.map(this.declaration, this).join(';\n')
    + this.indent(-1)
    + '\n' + this.indent() + '}\n';
};

/**
 * Visit rule node.
 */

Compiler.prototype.rule = function(node){
  if (this.compress) {
    return node.selectors.join(',')
      + '{'
      + node.declarations.map(this.declaration, this).join(';')
      + '}';
  }

  return this.indent() + node.selectors.join(',\n')
    + ' {\n'
    + this.indent(1)
    + node.declarations.map(this.declaration, this).join(';\n')
    + this.indent(-1)
    + '\n' + this.indent() + '}';
};

/**
 * Visit declaration node.
 */

Compiler.prototype.declaration = function(node){
  if (this.compress) {
    return node.property + ':' + node.value;
  }

  return this.indent() + node.property + ': ' + node.value;
};

/**
 * Increase, decrease or return current indentation.
 */

Compiler.prototype.indent = function(level) {
  this.level = this.level || 1;

  if (null != level) {
    this.level += level;
    return '';
  }

  return Array(this.level).join(this.indentation || '  ');
};

});
require.register("visionmedia-css/index.js", function(exports, require, module){

exports.parse = require('css-parse');
exports.stringify = require('css-stringify');

});
require.register("visionmedia-debug/index.js", function(exports, require, module){
if ('undefined' == typeof window) {
  module.exports = require('./lib/debug');
} else {
  module.exports = require('./debug');
}

});
require.register("visionmedia-debug/debug.js", function(exports, require, module){

/**
 * Expose `debug()` as the module.
 */

module.exports = debug;

/**
 * Create a debugger with the given `name`.
 *
 * @param {String} name
 * @return {Type}
 * @api public
 */

function debug(name) {
  if (!debug.enabled(name)) return function(){};

  return function(fmt){
    var curr = new Date;
    var ms = curr - (debug[name] || curr);
    debug[name] = curr;

    fmt = name
      + ' '
      + fmt
      + ' +' + debug.humanize(ms);

    // This hackery is required for IE8
    // where `console.log` doesn't have 'apply'
    window.console
      && console.log
      && Function.prototype.apply.call(console.log, console, arguments);
  }
}

/**
 * The currently active debug mode names.
 */

debug.names = [];
debug.skips = [];

/**
 * Enables a debug mode by name. This can include modes
 * separated by a colon and wildcards.
 *
 * @param {String} name
 * @api public
 */

debug.enable = function(name) {
  try {
    localStorage.debug = name;
  } catch(e){}

  var split = (name || '').split(/[\s,]+/)
    , len = split.length;

  for (var i = 0; i < len; i++) {
    name = split[i].replace('*', '.*?');
    if (name[0] === '-') {
      debug.skips.push(new RegExp('^' + name.substr(1) + '$'));
    }
    else {
      debug.names.push(new RegExp('^' + name + '$'));
    }
  }
};

/**
 * Disable debug output.
 *
 * @api public
 */

debug.disable = function(){
  debug.enable('');
};

/**
 * Humanize the given `ms`.
 *
 * @param {Number} m
 * @return {String}
 * @api private
 */

debug.humanize = function(ms) {
  var sec = 1000
    , min = 60 * 1000
    , hour = 60 * min;

  if (ms >= hour) return (ms / hour).toFixed(1) + 'h';
  if (ms >= min) return (ms / min).toFixed(1) + 'm';
  if (ms >= sec) return (ms / sec | 0) + 's';
  return ms + 'ms';
};

/**
 * Returns true if the given mode name is enabled, false otherwise.
 *
 * @param {String} name
 * @return {Boolean}
 * @api public
 */

debug.enabled = function(name) {
  for (var i = 0, len = debug.skips.length; i < len; i++) {
    if (debug.skips[i].test(name)) {
      return false;
    }
  }
  for (var i = 0, len = debug.names.length; i < len; i++) {
    if (debug.names[i].test(name)) {
      return true;
    }
  }
  return false;
};

// persist

if (window.localStorage) debug.enable(localStorage.debug);

});
require.register("component-color-parser/index.js", function(exports, require, module){

/**
 * Module dependencies.
 */

var colors = require('./colors');

/**
 * Expose `parse`.
 */

module.exports = parse;

/**
 * Parse `str`.
 *
 * @param {String} str
 * @return {Object}
 * @api public
 */

function parse(str) {
  return named(str)
    || hex3(str)
    || hex6(str)
    || rgb(str)
    || rgba(str);
}

/**
 * Parse named css color `str`.
 *
 * @param {String} str
 * @return {Object}
 * @api private
 */

function named(str) {
  var c = colors[str.toLowerCase()];
  if (!c) return;
  return {
    r: c[0],
    g: c[1],
    b: c[2]
  }
}

/**
 * Parse rgb(n, n, n)
 *
 * @param {String} str
 * @return {Object}
 * @api private
 */

function rgb(str) {
  if (0 == str.indexOf('rgb(')) {
    str = str.match(/rgb\(([^)]+)\)/)[1];
    var parts = str.split(/ *, */).map(Number);
    return {
      r: parts[0],
      g: parts[1],
      b: parts[2],
      a: 1
    }
  }
}

/**
 * Parse rgba(n, n, n, n)
 *
 * @param {String} str
 * @return {Object}
 * @api private
 */

function rgba(str) {
  if (0 == str.indexOf('rgba(')) {
    str = str.match(/rgba\(([^)]+)\)/)[1];
    var parts = str.split(/ *, */).map(Number);
    return {
      r: parts[0],
      g: parts[1],
      b: parts[2],
      a: parts[3]
    }
  }
}

/**
 * Parse #nnnnnn
 *
 * @param {String} str
 * @return {Object}
 * @api private
 */

function hex6(str) {
  if ('#' == str[0] && 7 == str.length) {
    return {
      r: parseInt(str.slice(1, 3), 16),
      g: parseInt(str.slice(3, 5), 16),
      b: parseInt(str.slice(5, 7), 16),
      a: 1
    }
  }
}

/**
 * Parse #nnn
 *
 * @param {String} str
 * @return {Object}
 * @api private
 */

function hex3(str) {
  if ('#' == str[0] && 4 == str.length) {
    return {
      r: parseInt(str[1] + str[1], 16),
      g: parseInt(str[2] + str[2], 16),
      b: parseInt(str[3] + str[3], 16),
      a: 1
    }
  }
}


});
require.register("component-color-parser/colors.js", function(exports, require, module){

module.exports = {
    aliceblue: [240, 248, 255]
  , antiquewhite: [250, 235, 215]
  , aqua: [0, 255, 255]
  , aquamarine: [127, 255, 212]
  , azure: [240, 255, 255]
  , beige: [245, 245, 220]
  , bisque: [255, 228, 196]
  , black: [0, 0, 0]
  , blanchedalmond: [255, 235, 205]
  , blue: [0, 0, 255]
  , blueviolet: [138, 43, 226]
  , brown: [165, 42, 42]
  , burlywood: [222, 184, 135]
  , cadetblue: [95, 158, 160]
  , chartreuse: [127, 255, 0]
  , chocolate: [210, 105, 30]
  , coral: [255, 127, 80]
  , cornflowerblue: [100, 149, 237]
  , cornsilk: [255, 248, 220]
  , crimson: [220, 20, 60]
  , cyan: [0, 255, 255]
  , darkblue: [0, 0, 139]
  , darkcyan: [0, 139, 139]
  , darkgoldenrod: [184, 132, 11]
  , darkgray: [169, 169, 169]
  , darkgreen: [0, 100, 0]
  , darkgrey: [169, 169, 169]
  , darkkhaki: [189, 183, 107]
  , darkmagenta: [139, 0, 139]
  , darkolivegreen: [85, 107, 47]
  , darkorange: [255, 140, 0]
  , darkorchid: [153, 50, 204]
  , darkred: [139, 0, 0]
  , darksalmon: [233, 150, 122]
  , darkseagreen: [143, 188, 143]
  , darkslateblue: [72, 61, 139]
  , darkslategray: [47, 79, 79]
  , darkslategrey: [47, 79, 79]
  , darkturquoise: [0, 206, 209]
  , darkviolet: [148, 0, 211]
  , deeppink: [255, 20, 147]
  , deepskyblue: [0, 191, 255]
  , dimgray: [105, 105, 105]
  , dimgrey: [105, 105, 105]
  , dodgerblue: [30, 144, 255]
  , firebrick: [178, 34, 34]
  , floralwhite: [255, 255, 240]
  , forestgreen: [34, 139, 34]
  , fuchsia: [255, 0, 255]
  , gainsboro: [220, 220, 220]
  , ghostwhite: [248, 248, 255]
  , gold: [255, 215, 0]
  , goldenrod: [218, 165, 32]
  , gray: [128, 128, 128]
  , green: [0, 128, 0]
  , greenyellow: [173, 255, 47]
  , grey: [128, 128, 128]
  , honeydew: [240, 255, 240]
  , hotpink: [255, 105, 180]
  , indianred: [205, 92, 92]
  , indigo: [75, 0, 130]
  , ivory: [255, 255, 240]
  , khaki: [240, 230, 140]
  , lavender: [230, 230, 250]
  , lavenderblush: [255, 240, 245]
  , lawngreen: [124, 252, 0]
  , lemonchiffon: [255, 250, 205]
  , lightblue: [173, 216, 230]
  , lightcoral: [240, 128, 128]
  , lightcyan: [224, 255, 255]
  , lightgoldenrodyellow: [250, 250, 210]
  , lightgray: [211, 211, 211]
  , lightgreen: [144, 238, 144]
  , lightgrey: [211, 211, 211]
  , lightpink: [255, 182, 193]
  , lightsalmon: [255, 160, 122]
  , lightseagreen: [32, 178, 170]
  , lightskyblue: [135, 206, 250]
  , lightslategray: [119, 136, 153]
  , lightslategrey: [119, 136, 153]
  , lightsteelblue: [176, 196, 222]
  , lightyellow: [255, 255, 224]
  , lime: [0, 255, 0]
  , limegreen: [50, 205, 50]
  , linen: [250, 240, 230]
  , magenta: [255, 0, 255]
  , maroon: [128, 0, 0]
  , mediumaquamarine: [102, 205, 170]
  , mediumblue: [0, 0, 205]
  , mediumorchid: [186, 85, 211]
  , mediumpurple: [147, 112, 219]
  , mediumseagreen: [60, 179, 113]
  , mediumslateblue: [123, 104, 238]
  , mediumspringgreen: [0, 250, 154]
  , mediumturquoise: [72, 209, 204]
  , mediumvioletred: [199, 21, 133]
  , midnightblue: [25, 25, 112]
  , mintcream: [245, 255, 250]
  , mistyrose: [255, 228, 225]
  , moccasin: [255, 228, 181]
  , navajowhite: [255, 222, 173]
  , navy: [0, 0, 128]
  , oldlace: [253, 245, 230]
  , olive: [128, 128, 0]
  , olivedrab: [107, 142, 35]
  , orange: [255, 165, 0]
  , orangered: [255, 69, 0]
  , orchid: [218, 112, 214]
  , palegoldenrod: [238, 232, 170]
  , palegreen: [152, 251, 152]
  , paleturquoise: [175, 238, 238]
  , palevioletred: [219, 112, 147]
  , papayawhip: [255, 239, 213]
  , peachpuff: [255, 218, 185]
  , peru: [205, 133, 63]
  , pink: [255, 192, 203]
  , plum: [221, 160, 203]
  , powderblue: [176, 224, 230]
  , purple: [128, 0, 128]
  , red: [255, 0, 0]
  , rosybrown: [188, 143, 143]
  , royalblue: [65, 105, 225]
  , saddlebrown: [139, 69, 19]
  , salmon: [250, 128, 114]
  , sandybrown: [244, 164, 96]
  , seagreen: [46, 139, 87]
  , seashell: [255, 245, 238]
  , sienna: [160, 82, 45]
  , silver: [192, 192, 192]
  , skyblue: [135, 206, 235]
  , slateblue: [106, 90, 205]
  , slategray: [119, 128, 144]
  , slategrey: [119, 128, 144]
  , snow: [255, 255, 250]
  , springgreen: [0, 255, 127]
  , steelblue: [70, 130, 180]
  , tan: [210, 180, 140]
  , teal: [0, 128, 128]
  , thistle: [216, 191, 216]
  , tomato: [255, 99, 71]
  , turquoise: [64, 224, 208]
  , violet: [238, 130, 238]
  , wheat: [245, 222, 179]
  , white: [255, 255, 255]
  , whitesmoke: [245, 245, 245]
  , yellow: [255, 255, 0]
  , yellowgreen: [154, 205, 5]
};
});
require.register("component-path/index.js", function(exports, require, module){

exports.basename = function(path){
  return path.split('/').pop();
};

exports.dirname = function(path){
  return path.split('/').slice(0, -1).join('/') || '.';
};

exports.extname = function(path){
  var base = exports.basename(path);
  if (!~base.indexOf('.')) return '';
  var ext = base.split('.').pop();
  return '.' + ext;
};
});
require.register("rework/index.js", function(exports, require, module){

module.exports = require('./lib/rework');
});
require.register("rework/lib/rework.js", function(exports, require, module){

/**
 * Module dependencies.
 */

var css = require('css')
  , visit = require('./visit');

/**
 * Expose `rework`.
 */

exports = module.exports = rework;

/**
 * Expose `visit` helpers.
 */

exports.visit = visit;

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

});
require.register("rework/lib/utils.js", function(exports, require, module){

/**
 * Strip `str` quotes.
 *
 * @param {String} str
 * @return {String}
 * @api private
 */

exports.stripQuotes = function(str) {
  if ('"' == str[0] || "'" == str[0]) return str.slice(1, -1);
  return str;
};
});
require.register("rework/lib/visit.js", function(exports, require, module){

/**
 * Visit `node`'s declarations recursively and
 * invoke `fn(declarations, node)`.
 *
 * @param {Object} node
 * @param {Function} fn
 * @api private
 */

exports.declarations = function(node, fn){
  node.rules.forEach(function(rule){
    // @media etc
    if (rule.rules) {
      exports.declarations(rule, fn);
      return;
    }

    // keyframes
    if (rule.keyframes) {
      rule.keyframes.forEach(function(keyframe){
        fn(keyframe.declarations, rule);
      });
      return;
    }

    // @charset, @import etc
    if (!rule.declarations) return;

    fn(rule.declarations, node);
  });
};

});
require.register("rework/lib/plugins/url.js", function(exports, require, module){

/**
 * Module dependencies.
 */

var utils = require('../utils')
  , visit = require('../visit');

/**
 * Map `url()` calls.
 *
 *   body {
 *     background: url(/images/bg.png);
 *   }
 *
 * yields:
 *
 *   body {
 *     background: url(http://example.com/images/bg.png);
 *   }
 *
 */

module.exports = function(fn) {
  return function(style, rework){
    visit.declarations(style, function(declarations){
      declarations.forEach(function(decl, i){
        if (!~decl.value.indexOf('url(')) return;
        decl.value = decl.value.replace(/url\(([^)]+)\)/g, function(_, url){
          url = utils.stripQuotes(url);
          return 'url("' + fn(url) + '")';
        });
      });
    });
  }
};

});
require.register("rework/lib/plugins/vars.js", function(exports, require, module){

/**
 * Module dependencies.
 */

var visit = require('../visit');

/**
 * Add variable support.
 *
 *   :root {
 *     var-header-color: #06c;
 *   }
 *
 *   h1 {
 *     background-color: var(header-color);
 *   }
 *
 * yields:
 *
 *   h1 {
 *     background-color: #06c;
 *   }
 *
 */

module.exports = function() {
  var map = {};

  function replace(str) {
    return str.replace(/\bvar\((.*?)\)/g, function(_, name){
      var val = map[name];
      if (val.match(/\bvar\(/)) val = replace(val);
      return val;
    });
  }

  return function vars(style){
    visit.declarations(style, function(declarations, node){
      // map vars
      declarations.forEach(function(decl){
        if (0 != decl.property.indexOf('var-')) return;
        var name = decl.property.replace('var-', '');
        map[name] = decl.value;
      });

      // substitute values
      declarations.forEach(function(decl){
        if (!decl.value.match(/\bvar\(/)) return;
        decl.value = replace(decl.value);
      });
    });
  }
};

});
require.register("rework/lib/plugins/ease.js", function(exports, require, module){

/**
 * Module dependencies.
 */

var visit = require('../visit');

/**
 * Easing functions.
 */

var ease = {
  'ease-in-out-back': 'cubic-bezier(0.680, -0.550, 0.265, 1.550)',
  'ease-in-out-circ': 'cubic-bezier(0.785, 0.135, 0.150, 0.860)',
  'ease-in-out-expo': 'cubic-bezier(1.000, 0.000, 0.000, 1.000)',
  'ease-in-out-sine': 'cubic-bezier(0.445, 0.050, 0.550, 0.950)',
  'ease-in-out-quint': 'cubic-bezier(0.860, 0.000, 0.070, 1.000)',
  'ease-in-out-quart': 'cubic-bezier(0.770, 0.000, 0.175, 1.000)',
  'ease-in-out-cubic': 'cubic-bezier(0.645, 0.045, 0.355, 1.000)',
  'ease-in-out-quad': 'cubic-bezier(0.455, 0.030, 0.515, 0.955)',
  'ease-out-back': 'cubic-bezier(0.175, 0.885, 0.320, 1.275)',
  'ease-out-circ': 'cubic-bezier(0.075, 0.820, 0.165, 1.000)',
  'ease-out-expo': 'cubic-bezier(0.190, 1.000, 0.220, 1.000)',
  'ease-out-sine': 'cubic-bezier(0.390, 0.575, 0.565, 1.000)',
  'ease-out-quint': 'cubic-bezier(0.230, 1.000, 0.320, 1.000)',
  'ease-out-quart': 'cubic-bezier(0.165, 0.840, 0.440, 1.000)',
  'ease-out-cubic': 'cubic-bezier(0.215, 0.610, 0.355, 1.000)',
  'ease-out-quad': 'cubic-bezier(0.250, 0.460, 0.450, 0.940)',
  'ease-in-back': 'cubic-bezier(0.600, -0.280, 0.735, 0.045)',
  'ease-in-circ': 'cubic-bezier(0.600, 0.040, 0.980, 0.335)',
  'ease-in-expo': 'cubic-bezier(0.950, 0.050, 0.795, 0.035)',
  'ease-in-sine': 'cubic-bezier(0.470, 0.000, 0.745, 0.715)',
  'ease-in-quint': 'cubic-bezier(0.755, 0.050, 0.855, 0.060)',
  'ease-in-quart': 'cubic-bezier(0.895, 0.030, 0.685, 0.220)',
  'ease-in-cubic': 'cubic-bezier(0.550, 0.055, 0.675, 0.190)',
  'ease-in-quad': 'cubic-bezier(0.550, 0.085, 0.680, 0.530)'
};

/**
 * Keys.
 */

var keys = Object.keys(ease);

/**
 * Provide additional easing functions:
 *
 *    #logo {
 *      transition: all 500ms ease-out-back;
 *    }
 *
 * yields:
 *
 *    #logo {
 *      transition: all 500ms cubic-bezier(0.175, 0.885, 0.320, 1.275)
 *    }
 *
 */

module.exports = function() {
  return function(style, rework){
    visit.declarations(style, substitute);
  }
};

/**
 * Substitute easing functions.
 *
 * @api private
 */

function substitute(declarations) {
  for (var i = 0, len = declarations.length; i < len; ++i) {
    var decl = declarations[i];
    if (!~decl.property.indexOf('transition')) continue;
    for (var k = 0; k < keys.length; ++k) {
      var key = keys[k];
      if (~decl.value.indexOf(key)) {
        decl.value = decl.value.replace(key, ease[key]);
        break;
      }
    }
  }
}

});
require.register("rework/lib/plugins/at2x.js", function(exports, require, module){

/**
 * Module dependencies.
 */

var utils = require('../utils')
  , path = require('path')
  , stripQuotes = utils.stripQuotes;

/**
 * Translate
 *
 *   .logo {
 *     background-image: url('/public/images/logo.png')
 *   }
 *
 * yields:
 *
 *   .logo {
 *     background-image: url('/public/images/logo.png')
 *   }
 *
 *   @media all and (-webkit-min-device-pixel-ratio : 1.5) {
 *     .logo {
 *       background-image: url("/public/images/logo@2x.png");
 *       background-size: contain
 *     }
 *   }
 *
 */

module.exports = function(vendors) {
  return function(style, rework){
    vendors = vendors || rework.prefixes;

    style.rules.forEach(function(rule){
      if (!rule.declarations) return;

      rule.declarations.filter(backgroundWithURL).forEach(function(decl){
        // parse url
        var i = decl.value.indexOf('url(');
        var url = stripQuotes(decl.value.slice(i + 4, decl.value.indexOf(')', i)));
        var ext = path.extname(url);

        // ignore .svg
        if ('.svg' == ext) return;

        // @2x value
        url = path.join(path.dirname(url), path.basename(url, ext) + '@2x' + ext);

        // wrap in @media
        style.rules.push({
          media: 'all and (-webkit-min-device-pixel-ratio: 1.5)',
          rules: [
            {
              selectors: rule.selectors,
              declarations: [
                {
                  property: 'background-image',
                  value: 'url("' + url + '")'
                },
                {
                  property: 'background-size',
                  value: 'contain'
                }
              ]
            }
          ]
        });
      });
    });
  };

  return function(style, rework) {
    vendors = vendors || rework.prefixes;
    visit(style.rules, style);
  };
};

/**
 * Filter background[-image] with url().
 */

function backgroundWithURL(decl) {
  return ('background' == decl.property
    || 'background-image' == decl.property)
    && ~decl.value.indexOf('url(');
}

});
require.register("rework/lib/plugins/colors.js", function(exports, require, module){

/**
 * Module dependencies.
 */

var parse = require('color-parser')
  , visit = require('../visit');

/**
 * Provide color manipulation helpers:
 *
 *    button {
 *      background: rgba(#eee, .5)
 *    }
 *
 * yields:
 *
 *    button {
 *      background: rgba(238, 238, 238, .5)
 *    }
 *
 */

module.exports = function() {
  return function(style, rework){
    visit.declarations(style, substitute);
  }
};

/**
 * Substitute easing functions.
 *
 * @api private
 */

function substitute(declarations) {
  for (var i = 0; i < declarations.length; ++i) {
    var decl = declarations[i];
    var val = decl.value;
    var index = val.indexOf('rgba');
    if (-1 == index) continue;

    // grab rgba(...) value
    var rgba = val.slice(index, val.indexOf(')', index));

    // arity > 2
    if (rgba.split(',').length > 2) continue;

    // color
    var c = rgba.slice(rgba.indexOf('(') + 1, rgba.indexOf(',')).trim();
    c = parse(c);

    // alpha
    var a = rgba.slice(rgba.indexOf(',') + 1, rgba.length);
    a = parseFloat(a);

    // format
    c = 'rgba('
      + c.r
      + ','
      + c.g
      + ','
      + c.b
      + ','
      + a
      + ')';

    // replace
    decl.value = val.replace(rgba + ')', c);
  }
}

});
require.register("rework/lib/plugins/extend.js", function(exports, require, module){

/**
 * Module dependencies.
 */

var debug = require('debug')('rework:extend');

/**
 * Add extension support.
 */

module.exports = function() {
  debug('use extend');
  return function(style, rework){
    var map = {};
    style.rules.forEach(function(rule){
      if (!rule.declarations) return;
      rule.selectors.forEach(function(sel, i){
        map[sel] = rule;
        if ('%' == sel[0]) rule.selectors.splice(i, 1);
      });
      visit(rule, map);
    });
  }
};

/**
 * Visit declarations and extensions.
 *
 * @param {Object} rule
 * @param {Object} map
 * @api private
 */

function visit(rule, map) {
  for (var i = 0; i < rule.declarations.length; ++i) {
    var decl = rule.declarations[i];
    var key = decl.property;
    var val = decl.value;
    if (!/^extends?$/.test(key)) continue;

    var extend = map[val];
    if (!extend) throw new Error('failed to extend "' + val + '"');

    var keys = Object.keys(map);
    keys.forEach(function(key){
      if (0 != key.indexOf(val)) return;
      var extend = map[key];
      var suffix = key.replace(val, '');
      debug('extend %j with %j', rule.selectors, extend.selectors);
      extend.selectors = extend.selectors.concat(rule.selectors.map(function(sel){
        return sel + suffix;
      }));
    });

    rule.declarations.splice(i--, 1);
  }
}

});
require.register("rework/lib/plugins/mixin.js", function(exports, require, module){

/**
 * Module dependencies.
 */

var utils = require('../utils')
  , visit = require('../visit');

/**
 * Define custom mixins.
 */

module.exports = function(mixins) {
  if (!mixins) throw new Error('mixins object required');
  return function(style, rework){
    visit.declarations(style, function(declarations){
      mixin(declarations, mixins);
    });
  }
};

/**
 * Visit declarations and apply mixins.
 *
 * @param {Array} declarations
 * @param {Object} mixins
 * @api private
 */

function mixin(declarations, mixins) {
  for (var i = 0; i < declarations.length; ++i) {
    var decl = declarations[i];
    var key = decl.property;
    var val = decl.value;
    var fn = mixins[key];
    if (!fn) continue;

    // invoke mixin
    var ret = fn(val);

    // apply properties
    for (var key in ret) {
      declarations.splice(i++, 0, {
        property: key,
        value: ret[key]
      });
    }

    // remove original
    declarations.splice(i, 1);
  }
}

});
require.register("rework/lib/plugins/keyframes.js", function(exports, require, module){

/**
 * Prefix keyframes.
 *
 *   @keyframes animation {
 *     from {
 *       opacity: 0;
 *     }
 *
 *     to {
 *       opacity: 1;
 *     }
 *   }
 *
 * yields:
 *
 *   @keyframes animation {
 *     from {
 *       opacity: 0;
 *     }
 *
 *     to {
 *       opacity: 1;
 *     }
 *   }
 *
 *   @-webkit-keyframes animation {
 *     from {
 *       opacity: 0;
 *     }
 *
 *     to {
 *       opacity: 1;
 *     }
 *   }
 *
 */

module.exports = function(vendors) {
  return function(style, rework){
    vendors = vendors || rework.prefixes;

    style.rules.forEach(function(rule){
      if (!rule.keyframes) return;

      vendors.forEach(function(vendor){
        if (vendor == rule.vendor) return;
        var clone = cloneKeyframes(rule);
        clone.vendor = vendor;
        style.rules.push(clone);
      });
    });
  }
};

/**
 * Clone keyframes.
 *
 * @param {Object} rule
 * @api private
 */

function cloneKeyframes(rule) {
  var clone = { name: rule.name };
  clone.vendor = rule.vendor;
  clone.keyframes = [];
  rule.keyframes.forEach(function(keyframe){
    clone.keyframes.push(cloneKeyframe(keyframe));
  });
  return clone;
}

/**
 * Clone `keyframe`.
 *
 * @param {Object} keyframe
 * @api private
 */

function cloneKeyframe(keyframe) {
  var clone = {};
  clone.values = keyframe.values.slice();
  clone.declarations = keyframe.declarations.map(function(decl){
    return {
      property: decl.property,
      value: decl.value
    }
  });
  return clone;
}
});
require.register("rework/lib/plugins/references.js", function(exports, require, module){

/**
 * Module dependencies.
 */

var visit = require('../visit');

/**
 * Provide property reference support.
 *
 *    button {
 *      width: 50px;
 *      height: @width;
 *      line-height: @height;
 *    }
 *
 * yields:
 *
 *    button {
 *      width: 50px;
*      height: 50px;
*      line-height: 50px;
 *    }
 *
 */

module.exports = function() {
  return function(style, rework){
    visit.declarations(style, substitute);
  }
};

/**
 * Substitute easing functions.
 *
 * @api private
 */

function substitute(declarations) {
  var map = {};

  for (var i = 0, len = declarations.length; i < len; ++i) {
    var decl = declarations[i];
    var key = decl.property;
    var val = decl.value;

    decl.value = val.replace(/@([-\w]+)/g, function(_, name){
      if (null == map[name]) throw new Error('@' + name + ' is not defined in this scope');
      return map[name];
    });

    map[key] = decl.value;
  }
}

});
require.register("rework/lib/plugins/opacity.js", function(exports, require, module){

/**
 * Add IE opacity support.
 *
 *   ul {
 *     opacity: 1 !important;
 *   }
 *
 * yields:
 *
 *   ul {
 *     opacity: 1 !important;
 *     -ms-filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=100) !important;
 *     filter: alpha(opacity=100) !important
 *   }
 *
 */

module.exports = function() {
  return function(style){
    style.rules.forEach(function(rule){
      if (!rule.declarations) return;
      rule.declarations.forEach(function(decl, i){
        if ('opacity' != decl.property) return;
        var args = decl.value.split(/\s+/);

        // parse float
        var n = args.shift();
        n = parseFloat(n, 10) * 100 | 0;

        // join args
        if (args.length) args = ' ' + args.join(' ');
        else args = '';

        // ie junk
        rule.declarations.push({
          property: '-ms-filter',
          value: 'progid:DXImageTransform.Microsoft.Alpha(Opacity=' + n + ')' + args
        });

        rule.declarations.push({
          property: 'filter',
          value: 'alpha(opacity=' + n + ')' + args
        });
      });
    });
  }
};
});
require.register("rework/lib/plugins/prefix-selectors.js", function(exports, require, module){

/**
 * Prefix selectors with `str`.
 *
 *    button {
 *      color: red;
 *    }
 *
 * yields:
 *
 *    #dialog button {
 *      color: red;
 *    }
 *
 */

module.exports = function(str) {
  return function(style){
    style.rules = style.rules.map(function(rule){
      if (!rule.selectors) return rule;
      rule.selectors = rule.selectors.map(function(selector){
        return str + ' ' + selector;
      });
      return rule;
    });
  }
};
});
require.register("rework/lib/plugins/prefix-value.js", function(exports, require, module){

/**
 * Module dependencies.
 */

var visit = require('../visit');

/**
 * Prefix `value`.
 *
 *    button {
 *      transition: height, transform 2s, width 0.3s linear;
 *    }
 *
 * yields:
 *
 *    button {
 *      -webkit-transition: height, -webkit-transform 2s, width 0.3s linear;
 *      -moz-transition: height, -moz-transform 2s, width 0.3s linear;
 *      transition: height, transform 2s, width 0.3s linear
 *    }
 *
 */

module.exports = function(value, vendors) {
  return function(style, rework){
    vendors = vendors || rework.prefixes;

    visit.declarations(style, function(declarations){
      for (var i = 0; i < declarations.length; ++i) {
        var decl = declarations[i];
        if (!~decl.value.indexOf(value)) continue;

        // ignore vendor-prefixed properties
        if ('-' == decl.property[0]) continue;

        // ignore vendor-prefixed values
        if (~decl.value.indexOf('-' + value)) continue;

        // vendor prefixed props
        vendors.forEach(function(vendor){
          var prop = 'transition' == decl.property
            ? vendor + decl.property
            : decl.property;

          declarations.splice(i++, 0, {
            property: prop,
            value: decl.value.replace(value, vendor + value)
          });
        });
      }
    });
  }
};

});
require.register("rework/lib/plugins/media.js", function(exports, require, module){

/**
 * Module dependencies.
 */

var utils = require('../utils');

/**
 * Define custom media types.
 *
 *   @media iphone {
 *
 *   }
 *
 * TODO: boundary regexps
 */

module.exports = function(obj) {
  var keys = Object.keys(obj);
  return function(style, rework){
    style.rules.forEach(function(rule){
      if (!rule.media) return;
      var i = keys.indexOf(rule.media);
      if (-1 == i) return;
      var key = keys[i];
      var val = obj[key];
      rule.media = rule.media.replace(key, val);
    });
  }
};
});
require.register("rework/lib/plugins/prefix.js", function(exports, require, module){

/**
 * Module dependencies.
 */

var visit = require('../visit');

/**
 * Prefix `prop`.
 *
 *   .button {
 *     border-radius: 5px;
 *   }
 *
 * yields:
 *
 *   .button {
 *     -webkit-border-radius: 5px;
 *     -moz-border-radius: 5px;
 *     border-radius: 5px;
 *   }
 *
 */

module.exports = function(prop, vendors) {
  var props = Array.isArray(prop)
    ? prop
    : [prop];

  return function(style, rework){
    vendors = vendors || rework.prefixes;
    visit.declarations(style, function(declarations, node){
      var only = node.vendor;
      var isKeyframes = !! node.keyframes;

      for (var i = 0; i < props.length; ++i) {
        var prop = props[i];

        for (var j = 0, len = declarations.length; j < len; ++j) {
          var decl = declarations[j];
          if (prop != decl.property) continue;

          // vendor prefixed props
          for (var k = 0; k < vendors.length; ++k) {
            if (!only && isKeyframes) continue;
            if (only && only != vendors[k]) continue;
            declarations.push({
              property: vendors[k] + decl.property,
              value: decl.value
            });
          }

          // original prop
          declarations.push(decl);
          declarations.splice(j, 1);
        }
      }
    });
  }
};

});
require.alias("visionmedia-css/index.js", "rework/deps/css/index.js");
require.alias("visionmedia-css-parse/index.js", "visionmedia-css/deps/css-parse/index.js");

require.alias("visionmedia-css-stringify/index.js", "visionmedia-css/deps/css-stringify/index.js");

require.alias("visionmedia-debug/index.js", "rework/deps/debug/index.js");
require.alias("visionmedia-debug/debug.js", "rework/deps/debug/debug.js");

require.alias("component-color-parser/index.js", "rework/deps/color-parser/index.js");
require.alias("component-color-parser/colors.js", "rework/deps/color-parser/colors.js");

require.alias("component-path/index.js", "rework/deps/path/index.js");

if (typeof exports == "object") {
  module.exports = require("rework");
} else if (typeof define == "function" && define.amd) {
  define(function(){ return require("rework"); });
} else {
  window["rework"] = require("rework");
}})();