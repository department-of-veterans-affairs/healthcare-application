'use strict'; // eslint-disable-line
const soap = require('soap');
const request = require('request');

const returnRouter = (options) => {
  const router = require('express').Router(); // eslint-disable-line
  const config = options.config;
  let soapClient = null;
  let esStatus = null;
  const readTLSArtifacts = require('../utils/tls')(config).readTLSArtifacts;
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

  router.get('/', (req, res) => {
    res.status(501).end();
  });
  router.get('/healthcheck', (req, res) => {
    res.status(200).end();
  });
  router.get('/healthcheck/es', (req, res) => {
    const id = config.validFormSubmissionId;

    if (id === undefined) {
      options.logger.info('Get Application Status - ERROR - ID REQUIRED');
      res.status(500).json({ error: 'need id' });
      return;
    }
    const getFormSubmissionStatusMsg = {
      formSubmissionId: id
    };

    if (!esStatus) {
      options.logger.info('Checking voaService status...');
      soapClient.getFormSubmissionStatus(getFormSubmissionStatusMsg, (err, response) => {
        if (err) {
          options.logger.info('voaService response had error', err);
          esStatus = 500;
          res.status(500).end();
        } else {
          options.logger.info('voaService request', {
            id,
            env: options.config.environment
          });

          options.logger.info('voaService response - SUCCESS', response);
          esStatus = 200;
          res.status(200).end();
        }
      });

      // Rate limit these checks
      setTimeout(() => { esStatus = null; }, config.esStatusRate);
    } else {
      // Return previously stored status
      res.status(esStatus).end();
    }
  });
  return router;
};
module.exports = returnRouter;
