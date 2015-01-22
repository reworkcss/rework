var rework = require('..');
var Promise = require('bluebird');

describe('rework', function() {

  describe('.use() call function', function() {
    it('should call the plugin function', function() {
      var r = rework('body { color: red; }');
      var called = false;
      var result = r.use(function(sheet, instance) {
        sheet.should.have.property('rules');
        instance.should.equal(r);
      });

      result.should.equal(r);
    });
  });

  describe('.then() call function', function() {
    it('should call the plugin function', function(done) {
      var r = rework('body { color: red; }');
      var called = false;
      var result = r
      .then(function(sheet) {
        sheet.rules[0].selectors = ['.cls'];

        // Check whether we're working with copies.
        sheet.should.not.equal(r.obj.stylesheet);

        return new Promise(function(resolve, reject) {
          resolve(sheet);
        });
      })
      .then(function(sheet) {
        sheet.rules[0].selectors.push('.cls2');
        return new Promise(function(resolve, reject) {
          resolve(sheet);
        });
      })
      .then(function(sheet) {
        var result = r.toString({compress: true});
        result.should.equal('.cls,.cls2{color:red;}');
        done();
      });
    });
  });

  describe('.toString() compress option', function() {
    it('should compress the output', function() {
      rework('body { color: red; }')
        .toString({ compress: true })
        .should.equal('body{color:red;}');
    });
  });

  describe('.toString() sourcemap option', function() {
    it('should inline sourcemap', function() {
      var result = rework('body { color: red; }').toString({
        compress: true,
        sourcemap: true
      });

      result.should.equal(
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

      result.code.should.equal('body{color:red;}');
      result.map.should.have.property('mappings');
      result.map.mappings.should.equal('AAAA,KAAO');
    });
  });

});
