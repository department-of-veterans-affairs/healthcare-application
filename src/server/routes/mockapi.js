'use strict'; // eslint-disable-line

const router = require('express').Router(); // eslint-disable-line

function returnRouter(options) {
  const mockResponses = {};

  router.post('/mock', (req, res) => {
    const verb = (req.body.verb || 'get').toLowerCase();
    mockResponses[verb] = mockResponses[verb] || {};
    mockResponses[verb][req.body.resource] = req.body.value;
    const result = { result: `set ${verb} ${req.body.resource} to ${req.body.value}` };
    options.logger.info(result);
    res.status(200).json(result);
  });

  router.all('/:resource', (req, res) => {
    const verb = req.method.toLowerCase();
    const verbResponses = mockResponses[verb];
    let result = null;
    if (verbResponses) {
      result = verbResponses[req.params.resource];
    }

    if (!result) {
      res.status(500);
      result = { error: `mock not initialized for ${verb} ${req.params.resource}` };
    }
    options.logger.info(result);
    res.json(result);
  });

  return router;
}

module.exports = returnRouter;
