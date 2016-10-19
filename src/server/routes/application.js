'use strict'; // eslint-disable-line
const fetch = require('isomorphic-fetch');
const soap = require('soap');
const request = require('request');
const router = require('express').Router(); // eslint-disable-line

const ApplicationJsonSchema = require('../../common/schema/application');
const validate = require('../../common/schema/validator').compile(ApplicationJsonSchema);
const veteranToSaveSubmitForm = require('../enrollment-system').veteranToSaveSubmitForm;

const FormData = require('form-data');

function returnRouter(options) {
  const config = options.config;
  const readTLSArtifacts = require('../utils/tls')(config).readTLSArtifacts;
  let soapClient = null;

  const tlsArtifacts = readTLSArtifacts();

  const wsdlUri = config.soap.wsdl || `${config.soap.endpoint}?wsdl`;
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
      soapClient = client;
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
      soapClient.saveSubmitForm(saveSubmitFormMsg, (err, response) => {
        if (err) {
          options.logger.info('voaService response:', response, 'error:', err);
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
    soapClient.getFormSubmissionStatus(getFormSubmissionStatusMsg, (err, response) => {
      if (err) {
        options.logger.info('voaService response had error', err, response);
        // TODO(awong): This may leak server config info on error. Is that a problem?
        res.status(500).json({ error: err });
      } else {
        options.logger.info('voaService response - SUCCESS', response);
        res.json({ response });
      }
    });
  }

  function checkRecaptcha(req, res, cb) {
    // if the captcha is diabled, go right into the
    // submit callback
    if (config.recaptcha.disabled) {
      cb(req, res);
    }

    const form = new FormData();
    form.append('secret', config.recaptcha.server);
    form.append('response', req.get('X-Captcha'));
    console.log(req.get('X-Captcha'));
    fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      body: form
    }).then(response => {
      return response.json();
    }).then(googleRes => {
      console.log(googleRes);
      if (googleRes.success) {
        cb(req, res);
      } else {
        res.status(500).json({ error: 'need reCAPTCHA' });
      }
    });
  }

  router.post('/', (req, res) => {
    checkRecaptcha(req, res, () => {
      submitApplication(req, res);
    });
  });

  router.get('/:id', (req, res) => {
    getApplicationStatus(req, res);
  });
  return router;
}

module.exports = returnRouter;
