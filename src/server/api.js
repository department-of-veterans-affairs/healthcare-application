'use strict'; // eslint-disable-line

const fs = require('fs');
const soap = require('soap');
const debug = require('debug')('hca:api');
const ajv = require('ajv');

const ApplicationJsonSchema = require('../common/schema/application');
const validate = ajv({ allErrors: true, errorDataPath: 'property', removeAdditional: true, useDefaults: true }).compile(ApplicationJsonSchema);
const veteranToSaveSubmitForm = require('./enrollment-system').veteranToSaveSubmitForm;
const config = require('../../config');

function readSecurityArtifacts() {
  try {
    fs.accessSync(config.soap.clientCertPath, fs.R_OK);
    fs.accessSync(config.soap.clientKeyPath, fs.R_OK);
    return {
      scheme: 'ClientSSL',
      certPath: config.soap.clientCertPath,
      keyPath: config.soap.clientKeyPath
    };
  } catch (ex) {
    debug("Can't read security artifacts. Starting without certificate and key.");
    return undefined;
  }
}

const securityArtifacts = readSecurityArtifacts();
let voaService = null;
soap.createClient(
  config.soap.wsdl,
  {
    security: securityArtifacts,
    wsdl_options: securityArtifacts === null ? null : { // eslint-disable-line
      rejectUnauthorized: false,
      strictSSL: false,
      requestCert: true
    }
  },
  (err, client) => {
    // TODO(awong): Handle error on connect so the server does not flap if the ES system is down.
    voaService = client;
  });

// TODO(awong): Remove config.url.

function submitApplication(req, res) {
  const contentType = req.get('Content-Type');
  if (contentType !== 'application/json') {
    res.status(400).json({ error: `Expects application/json content-type. Got "${contentType}"` });
    return;
  }

  debug(JSON.stringify(req.body, null, 2));
  const form = req.body;
  // TODO(awong): Use schema to sanitize input in addition to validation.
  const valid = validate(form, ApplicationJsonSchema, {});

  if (valid) {
    const request = veteranToSaveSubmitForm(form);
    voaService.saveSubmitForm(request, (err, response) => {
      if (err) {
        debug(`voaService response had error ${err}`);
        // TODO(awong): This may leak server config info on error. Is that a problem?
        res.status(500).send({ error: err });
      } else {
        res.send({ response });
      }
    });
  } else {
    res.status(400).json({ errors: validate.errors });
  }
}

module.exports = { submitApplication };
