'use strict'; // eslint-disable-line

const ajv = require('ajv');
const fs = require('fs');
const request = require('request');
const router = require('express').Router(); // eslint-disable-line
const soap = require('soap');

const ApplicationJsonSchema = require('../common/schema/application');
const validate = ajv({ allErrors: true, errorDataPath: 'property', removeAdditional: true, useDefaults: true }).compile(ApplicationJsonSchema);
const veteranToSaveSubmitForm = require('./enrollment-system').veteranToSaveSubmitForm;
const config = require('../../config');

function returnRouter(options) {
  const readTLSArtifacts = () => {
    const artifacts = {};
    try {
      artifacts.key = fs.readFileSync(config.soap.clientKeyPath);
      artifacts.cert = fs.readFileSync(config.soap.clientCertPath);
    } catch (ex) {
      options.logger.info("Can't read TLS artifacts. Starting without certificate and key.");
    }

    // The server CA is all public information and should always be checked in.
    if (Array.isArray(config.soap.serverCA)) {
      artifacts.ca = config.soap.serverCA.map((path) => fs.readFileSync(path));
    } else {
      artifacts.ca = fs.readFileSync(config.soap.serverCA);
    }

    return artifacts;
  };

  const tlsArtifacts = readTLSArtifacts();

  const wsdlUri = config.soap.wsdl || `${config.soap.endpoint}?wsdl`;
  let voaService = null;
  soap.createClient(
    wsdlUri,
    {
      request: request.defaults(tlsArtifacts),
      endpoint: config.soap.endpoint,
      wsdl_options: tlsArtifacts  // eslint-disable-line
    },
    (err, client) => {
      // TODO(awong): Handle error on connect so the server does not flap if the ES system is down.
      if (err) {
        options.logger.error('SOAP Client creation failed - ERROR', err);
        throw new Error('Unable to connect to VoaService');
      }
      voaService = client;
    });

  function submitApplication(req, res) {
    const contentType = req.get('Content-Type');
    if (contentType !== 'application/json') {
      res.status(400).json({ error: `Expects application/json content-type. Got "${contentType}"` });
      return;
    }

    const form = req.body;
    options.logger.verbose('Form Submission', form);
    // TODO(awong): Use schema to sanitize input in addition to validation.
    const valid = validate(form, ApplicationJsonSchema, {});

    if (valid) {
      const saveSubmitFormMsg = veteranToSaveSubmitForm(form);
      voaService.saveSubmitForm(saveSubmitFormMsg, (err, response) => {
        if (err) {
          options.logger.info('voaService response - error', err);
          // TODO(awong): This may leak server config info on error. Is that a problem?
          res.status(500).json({ error: err });
        } else {
          options.logger.info('voaService response - SUCCESS', response);
          res.json({ response });
        }
      });
    } else {
      res.status(400).json({ errors: validate.errors });
      options.logger.info('Form Validation - ERROR', validate.errors);
    }
  }

  function getApplicationStatus(req, res) {
    const id = req.params.id;
    if (id === undefined) {
      // TODO(all) what should be returned here?
      options.logger.info('Get Application Status - ERROR - ID REQUIRED');
      res.status(500).json({ error: 'need id' });
    }
    const getFormSubmissionStatusMsg = {
      formSubmissionId: id
    };
    voaService.getFormSubmissionStatus(getFormSubmissionStatusMsg, (err, response) => {
      if (err) {
        options.logger.info('voaService response had error', err);
        // TODO(awong): This may leak server config info on error. Is that a problem?
        res.status(500).json({ error: err });
      } else {
        options.logger.info('voaService response - SUCCESS', response);
        res.json({ response });
      }
    });
  }

  router.post('/', (req, res) => {
    submitApplication(req, res);
  });

  router.get('/:id', (req, res) => {
    getApplicationStatus(req, res);
  });
  return router;
}

module.exports = returnRouter;
