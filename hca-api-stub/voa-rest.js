const fs = require('fs');
const loopback = require('loopback');
const path = require('path');
const veteranToSaveSubmitForm = require('../src/server/enrollment-system').veteranToSaveSubmitForm;

const config = require('../config');

// TODO: node.js did not like `securityArtifacts` being declared as `let`. Why?
var securityArtifacts; // eslint-disable-line

function attach(app) {
  app.set('restApiRoot', '/api/hca/v1');

  // TODO: these elements should be sourced from a secure store.

  try {
    fs.accessSync(config.soap.clientCertPath, fs.R_OK);
    fs.accessSync(config.soap.clientKeyPath, fs.R_OK);
    securityArtifacts = {
      scheme: 'ClientSSL',
      certPath: config.soap.clientCertPath,
      keyPath: config.soap.clientKeyPath
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
      wsdl: config.soap.wsdl,
      url: config.soap.url,
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
        accepts: { arg: 'form', type: 'Object', http: { source: 'body' } },
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
