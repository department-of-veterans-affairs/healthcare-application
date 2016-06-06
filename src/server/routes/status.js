const validIdForEnv = (env) => {
  switch (env) {
  // SQA
  // 382363508
    case 'development':
      return '377609264';
    case 'staging':
      return '3623520284';
    case 'production':
      return '19831620752';
    default:
      return undefined;
  }
};

const returnRouter = (options) => {
  const router = require('express').Router(); // eslint-disable-line
  router.get('/', (req, res) => {
    res.status(501).end();
  });
  router.get('/healthcheck', (req, res) => {
    res.status(200).end();
  });
  router.get('/healthcheck/es', (req, res) => {
    const id = validIdForEnv(options.config.environment);

    if (id === undefined) {
      options.logger.info('Get Application Status - ERROR - ID REQUIRED');
      res.status(500).json({ error: 'need id' });
      return;
    }
    const getFormSubmissionStatusMsg = {
      formSubmissionId: id
    };
    options.soapClient.getFormSubmissionStatus(getFormSubmissionStatusMsg, (err, response) => {
      if (err) {
        options.logger.info('voaService response had error', err);
        res.status(500).end();
      } else {
        options.logger.info('voaService request', {
          id,
          env: options.config.environment
        });

        options.logger.info('voaService response - SUCCESS', response);
        res.status(200).end();
      }
    });
  });
  return router;
};
module.exports = returnRouter;
