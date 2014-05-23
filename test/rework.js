var rework = require('..');

describe('rework', function() {

  describe('.toString() compress option', function() {
    it('should compress the output', function() {
      rework('body { color: red; }')
        .toString({ compress: true })
        .should.equal('body{color:red;}');
    });
  });

  describe('.toString() sourcemap option', function() {
    it('should inline sourcemap', function() {
      rework('body { color: red; }')
        .toString({ compress: true, sourcemap: true })
        .should.equal(
          'body{color:red;}' + '\n' +
          '/*# sourceMappingURL=data:application/json;base64,' +
               'eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmNzc' +
               'yIsInNvdXJjZXMiOlsic291cmNlLmNzcyJdLCJuYW1lcy' +
               'I6W10sIm1hcHBpbmdzIjoiQUFBQSxLQUFPLFNBQVUifQ== */');
    });
  });

  describe('.toString() sourcemapAsObject and sourcemap options', function() {
    it('should return sourcemap as an object', function() {
      var result = rework('body { color: red; }')
        .toString({ compress: true, sourcemap: true, sourcemapAsObject: true });
      result.code.should.equal('body{color:red;}');
      result.map.should.have.property('mappings');
      result.map.mappings.should.equal('AAAA,KAAO,SAAU');
    });
  });

});
