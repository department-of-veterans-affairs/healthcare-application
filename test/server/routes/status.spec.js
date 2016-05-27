const request = require('supertest');

const status = require('../../../src/server/routes/status')();

const express = require('express');

const app = express();

app.use('/status', status);
describe.only('v1', () => {
  describe('/status', () => {
    it('should return a 501 error', (done) => {
      request(app)
        .get('/status')
        .expect(501)
        .end(done);
    });
  });
  describe('/status/healthcheck', () => {
    it('should return a 200 OK when you get', (done) => {
      request(app)
        .get('/status/healthcheck')
        .expect(200)
        .end(done);
    });
  });
});
