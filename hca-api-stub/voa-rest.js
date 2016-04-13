// liberally copy-pasta'ed from the loopback getFormSubmissionStatus example
var loopback = require('loopback');
var path = require('path');
var fs = require('fs');

// read canned JSON file for loopback's SOAP connector to use.
var anon1 = JSON.parse(fs.readFileSync(path.join(__dirname, './hasan-1.json'), 'utf8'));

function attach(app) {
  app.set('restApiRoot', '/api');

  var ds = loopback.createDataSource('soap',
    {
      connector: require('loopback-connector-soap'),
      remotingEnabled: true,
      // wsdl: 'http://vaausesrapp803.aac.va.gov:7401/voa/voaSvc?wsdl' // The url to WSDL
      wsdl: path.join(__dirname, './voa.wsdl')
    });

  ds.once('connected', function () {

    // Create the model
    var VoaService = ds.createModel('VoaService', {});

    // Add the methods
    VoaService.submit = function (form, cb) {

      console.log('*** intercept');
      
      var formPrime = anon1;

      VoaService.saveSubmitForm(formPrime, function (err, response) {
        console.log('saveSubmitForm: %j', response);
        var result = response;
        cb(err, result);
      });
    };

    VoaService.status = function (request, cb) {
      VoaService.getFormSubmissionStatus({retrieveFormSubmissionStatusRequest: request}, function (err, response) {
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
      var explorer = require('loopback-component-explorer')(app, { basePath: '/api', mountPath: '/explorer' });
      app.once('started', function (baseUrl) {
        console.log('Browse your REST API at %s%s', baseUrl, explorer.route);
      });
    } catch (e) {
      console.log(
        'Run `npm install loopback-component-explorer` to enable the LoopBack explorer' + e
      );
    }

    app.use(loopback.urlNotFound());
    app.use(loopback.errorHandler());
  });
}

module.exports = {
  attach: attach
};
 
