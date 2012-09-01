
var rework = require('..')
  , read = require('fs').readFileSync;

function positions() {
  var positions = ['absolute', 'relative', 'fixed'];

  return function(style){
    style.rules.forEach(function(rule){
      rule.declarations.forEach(function(decl, i){
        if (!~positions.indexOf(decl.property)) return;
        var args = decl.value.split(/\s+/);
        var arg, n;

        // remove original
        rule.declarations.splice(i, 1);

        // position prop
        rule.declarations.push({
          property: 'position',
          value: decl.property
        });

        // position
        while (args.length) {
          arg = args.shift();
          n = parseFloat(args[0]) ? args.shift() : 0;
          rule.declarations.push({
            property: arg,
            value: n
          });
        }
        
      });
    });
  }
}

var css = rework(read('examples/positions.css', 'utf8'))
  .use(positions())
  .toString()

console.log(css);