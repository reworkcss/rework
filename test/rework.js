var assert = require('node:assert');
var { describe, it } = require('node:test');
var rework = require('..');

describe('rework', function() {

  describe('.use() call function', function() {
    it('should call the plugin function', function() {
      var r = rework('body { color: red; }');
      var called = false;
      var result = r.use(function(sheet, instance) {
        assert.ok('rules' in sheet);
        assert.strictEqual(instance, r);
      });

      assert.strictEqual(result, r);
    });
  });

  describe('.toString() compress option', function() {
    it('should compress the output', function() {
      assert.strictEqual(
        rework('body { color: red; }').toString({ compress: true }),
        'body{color:red;}'
      );
    });
  });

  describe('.toString() sourcemap option', function() {
    it('should inline sourcemap', function() {
      var result = rework('body { color: red; }').toString({
        compress: true,
        sourcemap: true
      });

      assert.strictEqual(
        result,
        'body{color:red;}' + '\n' +
        '/*# sourceMappingURL=data:application/json;base64,' +
        'eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNvdXJjZS5jc3MiXSwibmFtZXMiOltdL' +
        'CJtYXBwaW5ncyI6IkFBQUEsS0FBTyIsInNvdXJjZXNDb250ZW50IjpbImJvZHkgey' +
        'Bjb2xvcjogcmVkOyB9Il19 */'
      );
    });
  });

  describe('.toString() sourcemapAsObject and sourcemap options', function() {
    it('should return sourcemap as an object', function() {
      var result = rework('body { color: red; }').toString({
        compress: true,
        sourcemap: true,
        sourcemapAsObject: true
      });

      assert.strictEqual(result.code, 'body{color:red;}');
      assert.ok('mappings' in result.map);
      assert.strictEqual(result.map.mappings, 'AAAA,KAAO');
    });
  });

});
