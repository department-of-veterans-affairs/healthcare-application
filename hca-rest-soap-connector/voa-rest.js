// liberally copy-pasta'ed from the loopback getFormSubmissionStatus example
var loopback = require('loopback');
var path = require('path');

var app = module.exports = loopback();

app.set('restApiRoot', '/api');

var ds = loopback.createDataSource('soap',
  {
    connector: require('loopback-connector-soap'),
    remotingEnabled: true,
    url: 'https://vaww.esrpre-prod.aac.va.gov/voa/voaSvc',
    wsdl: path.join(__dirname, './voa.wsdl'),
    security: {
      scheme: 'ClientSSL',
      certPath: 'healthcare.application.crt',
      keyPath: 'healthcare.application.key'
    },
    wsdl_options: {
      rejectUnauthorized: false,
      strictSSL: false,
      requestCert: true
    }
  });

ds.once('connected', function () {

  // Create the model
  var VoaService = ds.createModel('VoaService', {});

  // Add the methods
  VoaService.submit = function (form, cb) {
    VoaService.saveSubmitForm({saveSubmitFormResult: form}, function (err, response) {
      console.log('*** form:', form);
      console.log('saveSubmitForm: %j', response);
      var result = response;
      cb(err, result);
    });
  };

  VoaService.status = function (request, cb) {
    VoaService.getFormSubmissionStatus({retrieveFormSubmissionStatusRequest: request}, function (err, response) {
      console.log('***', form);
      console.log('getFormSubmissionStatus: %j', response);
      var result = response;
      cb(err, result);
    });
  };

  // Map to REST/HTTP
  loopback.remoteMethod(
    VoaService.submit, {
      accepts: [
        {arg: 'form', type: 'string', required: true,
          http: {source: 'query'}}
      ],
      returns: {arg: 'result', type: 'string', root: true},
      http: {verb: 'get', path: '/submit'}
    }
  );

  loopback.remoteMethod(
    VoaService.status, {
      accepts: [
        {arg: 'request', type: 'string', required: true,
          http: {source: 'query'}}
      ],
      returns: {arg: 'result', type: 'string', root: true},
      http: {verb: 'get', path: '/status'}
    }
  );

  // Expose to REST
  app.model(VoaService);

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