const loopback = require('loopback');
const voaRest = require('../hca-api-stub/voa-rest');

const app = loopback();
voaRest.attach(app);

// this is needed to talk to some of the internal HTTPS endpoints
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

app.listen(3000, () => {
  const baseUrl = 'http://127.0.0.1:3000';
  app.emit('started', baseUrl);
  console.log('LoopBack server listening @ %s%s', baseUrl, '/');
});
