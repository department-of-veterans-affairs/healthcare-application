const fs = require('fs');
const loopback = require('loopback');
const path = require('path');
const veteranToSaveSubmitForm = require('../src/server/enrollment-system').veteranToSaveSubmitForm;

// TODO: node.js did not like `securityArtifacts` being declared as `let`. Why?
var securityArtifacts; // eslint-disable-line

function attach(app) {
  app.set('restApiRoot', '/api/hca/v1');

  // TODO: use `NODE_ENV` should probably determining which endpoint is selected.
  const endpoint = {
    // ES "unofficial" (provided by Joshua) endpoints for development
    c7401: 'http://vaausesrapp803.aac.va.gov:7401/voa/voaSvc',
    e6401: 'https://vaausesrapp803.aac.va.gov:6401/voa/voaSvc',
    // ES "official" endpoints for development
    esSqa: 'https://vaww.esrstage1a.aac.va.gov/voa/voaSvc',
    esDev: 'https://vaww.esrdev30.aac.va.gov:8432/voa/voaSvc',
    // ES endpoints that require keys from PKI team and certs installed by Joshua
    esPreprod: 'https://vaww.esrpre-prod.aac.va.gov/voa/voaSvc',
    esProd: 'https://vaww.esr.aac.va.gov/voa/voaSvc'
  };

  /*
      TODO: there are alleged certificate chain issues that may cause the following error
      when posting to the endpoint (this is related to self-signed certificates):

        {
          "error": {
            "name": "Error",
            "status": 500,
            "message": "unable to verify the first certificate",
            "code": "UNABLE_TO_VERIFY_LEAF_SIGNATURE",
            "stack": "Error: unable to verify the first certificate\n    at Error (native)\n    at TLSSocket.<anonymous> (_tls_wrap.js:1003:38)\n    at emitNone (events.js:67:13)\n    at TLSSocket.emit (events.js:166:7)\n    at TLSSocket._finishInit (_tls_wrap.js:570:8)"
          }
        }

      The short-term work-around is to set an environment variable that influences the TLS library:

        export NODE_TLS_REJECT_UNAUTHORIZED="0"

      an alternative is to set this in `src/server.js` as:

        process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"

        ...although this feels icky.

     For testing, I've set this in my `lauch.json`'s `env` section.
  */

  // TODO: these elements should be sourced from a secure store.
  const cert = path.join(__dirname, './healthcare.application.crt');
  const key = path.join(__dirname, './healthcare.application.key');

  try {
    fs.accessSync(cert, fs.R_OK);
    fs.accessSync(key, fs.R_OK);
    securityArtifacts = {
      scheme: 'ClientSSL',
      certPath: cert,
      keyPath: key
    };
  } catch (ex) {
    securityArtifacts = null;
    console.log("Can't read security artifacts. Starting without certificate and key.");
  }

  // TODO: do we need to consider the possibility that the cert/key disappear between
  // `try` and `loopback.createDataSource()`?

  const ds = loopback.createDataSource('soap',
    {
      connector: require('loopback-connector-soap'),
      remotingEnabled: true,
      wsdl: path.join(__dirname, './voa.wsdl'),
      url: endpoint.esPreprod,
//      wsdl: endpoint.esDev + '?wsdl',
//      url: endpoint.esDev,
      security: securityArtifacts,
      wsdl_options: securityArtifacts === null ? null : { // eslint-disable-line
        rejectUnauthorized: false,
        strictSSL: false,
        requestCert: true
      }
    });

  ds.once('connected', () => {
    // Create the model
    const VoaService = ds.createModel('VoaService', {});

    // Add the methods
    VoaService.submit = (form, cb) => {
      const request = veteranToSaveSubmitForm(form);
      VoaService.saveSubmitForm(request, (err, response) => {
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
        accepts: { arg: 'form', type: 'Object', http: {source: 'body'} },
        returns: { arg: 'result', type: 'string', root: true },
        http: { path: '/submit' }
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
      const explorer = require('loopback-component-explorer')(app, { basePath: app.get('restApiRoot'), mountPath: '/explorer' });
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
