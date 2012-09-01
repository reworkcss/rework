
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
 *      background-image: url('/public/images/logo.png')
 *    }
 * 
 * yields:
 * 
 *   .logo {
 *      background-image: url('/public/images/logo.png')
 *    }
 *    
 *    @media all and (-webkit-min-device-pixel-ratio : 1.5) {
 *      .logo {
 *        background-image: url("/public/images/logo@2x.png")
 *      }
 *    }
 * 
 */

module.exports = function(vendors) {
  return function(style, rework){
    vendors = vendors || rework.prefixes;

    style.rules.forEach(function(rule){
      if (!rule.declarations) return;
      rule.declarations.forEach(function(decl){
        var i = decl.value.indexOf('url(');

        // no url()
        if (-1 == i) return;

        // parse url
        var url = stripQuotes(decl.value.slice(i + 4, decl.value.indexOf(')', i)));
        var ext = path.extname(url);

        // @2x value
        url = path.join(path.dirname(url), path.basename(url, ext) + '@2x' + ext);

        // wrap in @media
        style.rules.push({
          media: 'all and (-webkit-min-device-pixel-ratio : 1.5)',
          rules: [
            {
              selectors: rule.selectors,
              declarations: [
                {
                  property: decl.property,
                  value: 'url("' + url + '")'
                }
              ]
            }
          ]
        });
      });
    });
  }
};