var loopback = require('loopback');
var voaRest = require('../hca-api-stub/voa-rest');

var app = loopback();
voaRest.attach(app);

app.listen(3000, function () {
  var baseUrl = 'http://127.0.0.1:3000';
  app.emit('started', baseUrl);
  console.log('LoopBack server listening @ %s%s', baseUrl, '/');
});
