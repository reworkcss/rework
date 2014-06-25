var rework = require('..');

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
        'eyJ2ZXJzaW9uIjozLCJmaWxlIjpudWxsLCJzb3VyY2VzIjpbInNvdXJjZS5jc3MiX' +
        'SwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsS0FBTyIsInNvdXJjZXNDb250ZW' +
        '50IjpbImJvZHkgeyBjb2xvcjogcmVkOyB9Il19 */'
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
