const loopback = require('loopback');
const path = require('path');
const veteranToSaveSubmitForm = require('../src/server/enrollment-system').veteranToSaveSubmitForm;

function attach(app) {
  app.set('restApiRoot', '/v1/api');

  const endpoint = {
    c7401: 'http://vaausesrapp803.aac.va.gov:7401/voa/voaSvc',
    e6401: 'https://vaausesrapp803.aac.va.gov:6401/voa/voaSvc',
    e8432: 'https://vaww.esrdev30.aac.va.gov:8432/voa/voaSvc',
  };

  const ds = loopback.createDataSource('soap',
    {
      connector: require('loopback-connector-soap'),
      remotingEnabled: true,
      wsdl: path.join(__dirname, './voa.wsdl'),
      url: endpoint.e8432
    });

  ds.once('connected', () => {
    // Create the model
    const VoaService = ds.createModel('VoaService', {});

    // Add the methods
    // TODO(awong): Rename "form" to "veteran" uniformly. #210
    VoaService.submit = (form, cb) => {
      VoaService.saveSubmitForm(veteranToSaveSubmitForm(form), (err, response) => {
        const result = response;
        cb(err, result);
      });
    };

    VoaService.status = (request, cb) => {
      VoaService.getFormSubmissionStatus(request, (err, response) => {
        const result = response;
        cb(err, result);
      });
    };

    // Map to REST/HTTP
    loopback.remoteMethod(
      VoaService.submit, {
        accepts: [
          { arg: 'form', type: 'Object', required: true,
            http: { source: 'query' } }
        ],
        returns: { arg: 'result', type: 'string', root: true },
        http: { verb: 'get', path: '/submit' }
      }
    );

    loopback.remoteMethod(
      VoaService.status, {
        accepts: [
          { arg: 'request', type: 'Object', required: true,
            http: { source: 'query' } }
        ],
        returns: { arg: 'result', type: 'string', root: true },
        http: { verb: 'get', path: '/status' }
      }
    );

    // Expose to REST
    app.model(VoaService);

    // LoopBack REST interface
    app.use(app.get('restApiRoot'), loopback.rest());

    // API explorer (if present)
    try {
      const explorer = require('loopback-component-explorer')(app, { basePath: '/hca', mountPath: '/explorer' });
      app.once('started', (baseUrl) => {
        console.log('Browse your REST API at %s%s', baseUrl, explorer.route);
      });
    } catch (e) {
      console.log(`Run "npm install loopback-component-explorer" to enable the LoopBack explorer ${e}`);
    }

    app.use(loopback.urlNotFound());
    app.use(loopback.errorHandler());
  });
}

module.exports = {
  attach
};
