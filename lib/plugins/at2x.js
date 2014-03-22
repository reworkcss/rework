
/**
 * Module dependencies.
 */

var utils = require('../utils');
var path = require('path');
var urls = require('url');
var imagesize = require('image-size');
var stripQuotes = utils.stripQuotes;

/**
 * Vendor crap.
 */

var query = [
  '(min--moz-device-pixel-ratio: 1.5)',
  '(-o-min-device-pixel-ratio: 3/2)',
  '(-webkit-min-device-pixel-ratio: 1.5)',
  '(min-device-pixel-ratio: 1.5)',
  '(min-resolution: 144dpi)',
  '(min-resolution: 1.5dppx)'
].join(', ');

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

module.exports = function(opts) {
  opts = opts || {};

  return function(style){
    style.rules.forEach(function(rule){
      if (!rule.declarations) return;

      var backgroundSize = rule.declarations.filter(backgroundWithSize).map(value)[0] || 'contain';

      rule.declarations.filter(backgroundWithHiResURL).forEach(function(decl){
        if ('comment' == decl.type) return;

        // parse url
        var val = decl.value.replace(/\s+(at-2x)\s*(;|$)/, '$2');
        decl.value = val;
        var i = val.indexOf('url(');
        var url = stripQuotes(val.slice(i + 4, val.indexOf(')', i)));
        var ext = path.extname(url);
        var isLocalFile = url.search(/http[s]?/i) !== 0;

        // ignore .svg
        if ('.svg' == ext) return;

        // @2x value
        if (isLocalFile) {
          url = appendRetinaSuffix(url, ext);
        } else {
          var parsed = urls.parse(url);
          parsed.pathname = appendRetinaSuffix(parsed.pathname, ext);
          url = urls.format(parsed);
        }

        // If no size defined and file is local (no http/https/relative protocol),
        // try to get it from the image
        if (backgroundSize === 'contain' && isLocalFile) {
          var loc = opts.baseDir ? path.join(opts.baseDir, url) : url;

          var result = imagesize(loc);
          var width = result.width === 1 ? 1 : Math.floor(result.width / 2);
          var height = result.height === 1 ? 1 : Math.floor(result.height / 2);
          backgroundSize = width + 'px ' + height + 'px';
        }

        // wrap in @media
        style.rules.push({
          type: 'media',
          media: query,
          rules: [
            {
              type: 'rule',
              selectors: rule.selectors,
              declarations: [
                {
                  type: 'declaration',
                  property: 'background-image',
                  value: 'url("' + url + '")'
                },
                {
                  type: 'declaration',
                  property: 'background-size',
                  value: backgroundSize
                }
              ]
            }
          ]
        });
      });
    });
  };
};

/**
 * Append default retina suffix (@2x) to a path
 */
function appendRetinaSuffix(url, ext) {
  return path.join(path.dirname(url), path.basename(url, ext) + '@2x' + ext);
}

/**
 * Filter background[-image] with url().
 */

function backgroundWithHiResURL(decl) {
  return ('background' == decl.property
    || 'background-image' == decl.property)
    && ~decl.value.indexOf('url(')
    && ~decl.value.indexOf('at-2x');
}

/**
 * Predicate on background-size property.
 */

function backgroundWithSize(decl) {
  return 'background-size' == decl.property;
}

/**
 * Return value atribute of a declaration.
 */

function value(decl) {
  return decl.value;
}
