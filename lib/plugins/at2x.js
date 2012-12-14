
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
