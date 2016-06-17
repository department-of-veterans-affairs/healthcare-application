const fs = require('fs');
const tlsUtils = (config) => {
  return {
    readTLSArtifacts: () => {
      const artifacts = {};

      // If either the client cert or key is set, try to read both and die hard if
      // either fails. It's nonsensical to have one without the other and it's hard to
      // debug a server that doesn't have a cert/key when you think it does so
      // hard dying is good here on a configuration error.
      if (config.soap.clientKeyPath || config.soap.clientCertPath) {
        artifacts.key = fs.readFileSync(config.soap.clientKeyPath);
        artifacts.cert = fs.readFileSync(config.soap.clientCertPath);
      }

      // The server CA is all public information and should always be checked in.
      if (Array.isArray(config.soap.serverCA)) {
        artifacts.ca = config.soap.serverCA.map((path) => fs.readFileSync(path));
      } else {
        artifacts.ca = fs.readFileSync(config.soap.serverCA);
      }

      return artifacts;
    }
  };
};

module.exports = tlsUtils;
