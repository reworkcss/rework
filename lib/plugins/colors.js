
/**
 * Module dependencies.
 */

var parse = require('color-parser');
var functions = require('./function');

/**
 * Provide color manipulation helpers.
 */

module.exports = function() {
  return functions({

    /**
     * Converts RGBA(color, alpha) to the corrosponding RGBA(r, g, b, a) equivalent. 
     *
     *    background: rgba(#eee, .5)
     *    background: rgba(white, .2)
     *
     */

    rgba: function(color, alpha){
      if (2 == arguments.length) {
        var c = parse(color.trim());
        var args = [c.r, c.g, c.b, alpha];
      } else {
        var args = [].slice.call(arguments);
      }

      return 'rgba(' + args.join(', ') + ')';
    },

    /**
     * Converts HSV (HSB) color values to RGB.
     * Saturation and brightness can be expressed as floats or percentages.
     *
     *     color: hsb(220, 45%, .3);
     *     color: hsb(220deg, 0.45, 30%);
     *
     */

    hsb: function (hue, saturation, value) {
      var rgb = hsb2rgb(hue, saturation, value);
      return 'rgb(' + rgb.join(', ') + ')';
    },


    /**
     * Converts HSV (HSB) color values with alpha specified to RGBa.
     * Saturation, brightness and alpha can be expressed as floats or
     * percentages.
     *
     *     color: hsba(220, 45%, .3, .4);
     *     color: hsba(220deg, 0.45, 30%, 40%);
     *
     */

    hsba: function (hue, saturation, value, alpha) {
      alpha = /%/.test(alpha)
        ? parseInt(alpha, 10) / 100
        : parseFloat(alpha, 10);
      
      alpha = String(alpha).replace(/^0+\./, '.');

      var rgb = hsb2rgb(hue, saturation, value);
      return 'rgba(' + rgb.join(', ') + ', ' + alpha + ')';
    }
  });
};

/**
 * HSB conversion.
 */

function hsb2rgb(hue, saturation, value) {
  hue = (parseInt(hue, 10) || 0) % 360;

  saturation = /%/.test(saturation)
    ? parseInt(saturation, 10) / 100
    : parseFloat(saturation, 10);

  value = /%/.test(value)
    ? parseInt(value, 10) / 100
    : parseFloat(value, 10);

  var rgb;
  if (0 == saturation) return [value, value, value];

  var side = hue / 60;
  var chroma = value * saturation;
  var x = chroma * (1 - Math.abs(side % 2 - 1));
  var match = value - chroma;

  switch (Math.floor(side)) {
    case 0: rgb = [chroma, x, 0]; break;
    case 1: rgb = [x, chroma, 0]; break;
    case 2: rgb = [0, chroma, x]; break;
    case 3: rgb = [0, x, chroma]; break;
    case 4: rgb = [x, 0, chroma]; break;
    case 5: rgb = [chroma, 0, x]; break;
    default: rgb = [0, 0, 0];
  }

  rgb[0] = Math.round(255 * (rgb[0] + match));
  rgb[1] = Math.round(255 * (rgb[1] + match));
  rgb[2] = Math.round(255 * (rgb[2] + match));

  return rgb;
}
