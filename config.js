const path = require('path');

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

const vaInternalChain = [
  'certs/VA Internal Subordinate CA 1.pem',
  'certs/VA Internal Root CA.pem'
];

const vaFederalCommonPolicyChain = [
  'certs/Veterans Affairs Device CA B2.pem',
  'certs/Betrusted Production SSP CA A1.pem',
  'certs/Federal Common Policy CA.pem'
];

const ca = {
  esDev: vaFederalCommonPolicyChain,
  esPreprod: vaFederalCommonPolicyChain,
  esSqa: vaFederalCommonPolicyChain,
  esProd: vaInternalChain
}

const config = {
  // The port the server listens on.
  port: 3000,

  // Base Path that the react application mounts on. Used to construct navigation links, etc.
  basePath: '/healthcare/apply/application',

  // API root.
  apiRoot: '/api/hca/v1',

  // Configuration of the soap protocol.
  soap: {
    // URL of the soap endpoint to connect to.
    endpoint: endpoint.esDev,

    // Override the default wsdl URL. By default the wsdl file is expected to be at `url?wsdl`.
    // Set to undefined for the default.
    //
    // Current set to a local version of the file so the server will start even if off the network.
    //
    // TODO(awong): Figure out how to safely use this fallback on the local version of the wsdl.
    wsdl: path.join(__dirname, 'hca-api-stub/voa.wsdl'),

    // Path or Array of paths to PEM file containing certificates that should be trusted for the SOAP
    // endpoint server TLS negotation.
    //
    // Normally this should be one cert corresponding to the final self-signed certificate at the
    // end of the certificate chain presented by the server. However, if the server has a
    // misconfigured trust chain (eg., it has unnecessary certificates that aren't trusted, or
    // an issuer is missing from the chain) it becomes necessary to explicilty include all the
    // missing issuers and extraneous (untrusted) certificates here directly.
    //
    // @type {Array|String}
    serverCA: ca.esDev,

    // Paths to Client TLS certificate in key files if using Client TLS authentication. Files should
    // be in PEM format.
    //
    // Client certificate and keys are only needed for `prod` and `preprod`. Note that the
    // key is not checked into source control because it is sekret.
    //
    // clientCertPath: path.join(__dirname, 'certs/VA Healthcare Application - chain.pem'),
    // clientKeyPath: path.join(__dirname, 'certs/VA Healthcare Application.key'),
  },

  environment: process.env.NODE_ENV || 'development',
  // This is a valid form submission ID from the ES system that will be used by the health check to 
  // verify that the ES system is up.
  validFormSubmissionId: '377609264',

};

module.exports = config;
