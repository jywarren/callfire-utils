var test = require('tape');

SwaggerClient = require('swagger-client');
$ = require('jquery');
require('../dist/callfire-utils.js');

test("Basic functions", function(t) {

  t.equal(true, true, "Work.");
  t.end();

});
