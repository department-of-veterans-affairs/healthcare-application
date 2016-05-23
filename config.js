const path = require('path');

// TODO: use `NODE_ENV` should probably determining which endpoint is selected.
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

const config = {
  // The port the server listens on.
  port: 3000,

  // Base Path that the react application mounts on. Used to construct navigation links, etc.
  basePath: '/healthcare/apply',

  // API root.
  apiRoot: '/api/hca/v1',

  // Configuration of the soap protocol.
  soap: {
    // URL of the soap endpoint to connect to.
    url: endpoint.esDev,

    // Override the default wsdl URL. By default the wsdl file is expected to be at `url?wsdl`.
    // Set to undefined for the default.
    //
    // Current set to a local version of the file so the server will start even if off the network.
    wsdl: path.join(__dirname, 'hca-api-stub/voa.wsdl'),

    // Path to PEM file containing a certificate to use as the root of trust for the SOAP endpoint
    // this connects to. Note that this can only be one cert. If the server has an certificate chain
    // that does not conform with the RFC (this is a common misconfiguration) then this must be the
    // issuer of final certificate in the chain before non-compliant ordering occurs. Often, this
    // means it must be the issuer of the first cert in the chain.
    serverCAPath: undefined,

    // Paths to Client TLS certificate in key files if using Client TLS authentication. Files should
    // be in PEM format.
    clientCertPath: path.join(__dirname, 'certs/soapclient.crt'),
    clientKeyPath: path.join(__dirname, 'certs/soapclient.key'),
  },

  environment: process.env.NODE_ENV || 'development',
};

module.exports = config;
