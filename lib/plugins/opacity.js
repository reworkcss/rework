
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