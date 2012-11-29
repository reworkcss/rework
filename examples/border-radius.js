
var rework = require('..')
  , read = require('fs').readFileSync;

var css = rework(read('examples/border-radius.css', 'utf8'))
  .use(rework.mixin({ 'border-radius': borderRadius }))
  .toString()

function borderRadius(str) {
  var vals = str.split(/\s+/);
  var pos;
  var ret;

  for (var i = 0; i < vals.length; ++i) {
    var val = vals[i];
    if (isPosition(val)) {
      ret = ret || {};
      pos = val;
      val = vals[++i];
      switch (pos) {
        case 'top':
        case 'bottom':
          ret['border-' + pos + '-left-radius'] = val;
          ret['border-' + pos + '-right-radius'] = val;
          break;
        case 'left':
        case 'right':
          ret['border-top-' + pos + '-radius'] = val;
          ret['border-bottom-' + pos + '-radius'] = val;
          break;
      }
    }
  }

  if (!ret) {
    return {
      'border-radius': str
    }
  }

  return ret;
}

function isPosition(str) {
  return 'top' == str
    || 'bottom' == str
    || 'left' == str
    || 'right' == str;
}

console.log(css);