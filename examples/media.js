
var rework = require('..')
  , read = require('fs').readFileSync;

var css = rework(read('examples/media.css', 'utf8'))
  .vendors(['-webkit-', '-moz-'])
  .use(rework.prefix('border-radius'))
  .use(rework.media({
    'phone': 'only screen and (min-device-width : 320px) and (max-device-width : 480px)',
    'phone-landscape': '@media only screen and (min-width : 321px)'
  }))
  .toString()

console.log(css);
