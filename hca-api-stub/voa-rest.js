const loopback = require('loopback');
const path = require('path');

function attach(app) {
  app.set('restApiRoot', '/api');

  const ds = loopback.createDataSource('soap',
    {
      connector: require('loopback-connector-soap'),
      remotingEnabled: true,
      // wsdl: 'http://vaausesrapp803.aac.va.gov:7401/voa/voaSvc?wsdl' // The url to WSDL
      wsdl: path.join(__dirname, './voa.wsdl')
    });

  ds.once('connected', () => {
    // Create the model
    const VoaService = ds.createModel('VoaService', {});

    // Add the methods
    VoaService.submit = (form, cb) => {
      VoaService.saveSubmitForm(form, (err, response) => {
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
      const explorer = require('loopback-component-explorer')(app, { basePath: '/api', mountPath: '/explorer' });
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
