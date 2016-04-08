var loopback = require('loopback');
var path = require('path');

var app = module.exports = loopback();

app.set('restApiRoot', '/api');

var ds = loopback.createDataSource('soap',
  {
    connector: require('loopback-connector-soap'),
    remotingEnabled: true,
    wsdl: 'http://localhost:1212/hello?WSDL' // The url to WSDL
    //wsdl: path.join(__dirname, './hello.wsdl')
  });

// Unfortunately, the methods from the connector are mixed in asynchronously
// This is a hack to wait for the methods to be injected
ds.once('connected', function () {

  // Create the model
  var HelloService = ds.createModel('HelloService', {});

  // Refine the methods
  HelloService.hello = function (str, cb) {
    HelloService.sayHello({arg0: str}, function (err, response) {
      console.log('***', str);
      console.log('Response: %j', response);
      //var result = response.sayHelloResponse;
      var result = response;
      cb(err, result);
    });
  };
  
  HelloService.guid = function (str, cb) {
    HelloService.getGUID(null, function (err, response) {
      console.log('***', str);
      console.log('Response: %j', response);
      var result = response;
      cb(err, result);
    });
  };

  HelloService.bye = function (str, cb) {
    HelloService.sayHello({arg0: str}, function (err, response) {
      console.log('***', str);
      console.log('Response: %j', response);
      var result = response;
      cb(err, result);
    });
  };

  // Map to REST/HTTP
  loopback.remoteMethod(
    HelloService.hello, {
      accepts: [
        {arg: 'arg0', type: 'string', required: true,
          http: {source: 'query'}}
      ],
      returns: {arg: 'return', type: 'string', root: true},
      http: {verb: 'get', path: '/hello'}
    }
  );

  loopback.remoteMethod(
    HelloService.guid, {
      accepts: [
        {http: {source: 'query'}}
      ],
      returns: {arg: 'return', type: 'string', root: true},
      http: {verb: 'get', path: '/guid'}
    }
  );
  
    loopback.remoteMethod(
    HelloService.bye, {
      accepts: [
        {http: {source: 'query'}}
      ],
      returns: {arg: 'return', type: 'string', root: true},
      http: {verb: 'get', path: '/bye'}
    }
  );
  
  // Expose to REST
  app.model(HelloService);

  // LoopBack REST interface
  app.use(app.get('restApiRoot'), loopback.rest());
  
  // API explorer (if present)
  try {
    var explorer = require('loopback-explorer')(app);
    app.use('/explorer', explorer);
    app.once('started', function (baseUrl) {
      console.log('Browse your REST API at %s%s', baseUrl, explorer.route);
    });
  } catch (e) {
    console.log(
      'Run `npm install loopback-explorer` to enable the LoopBack explorer'
    );
  }

  app.use(loopback.urlNotFound());
  app.use(loopback.errorHandler());

  if (require.main === module) {
    app.start();
  }

});

app.start = function () {
  return app.listen(3000, function () {
    var baseUrl = 'http://127.0.0.1:3000';
    app.emit('started', baseUrl);
    console.log('LoopBack server listening @ %s%s', baseUrl, '/');
  });
};



