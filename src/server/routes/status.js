
function returnRouter() {
  const router = require('express').Router(); // eslint-disable-line
  router.get('/', (req, res) => {
    res.status(501).end();
  });
  router.get('/healthcheck', (req, res) => {
    res.status(200).end();
  });
  return router;
}
module.exports = returnRouter;
