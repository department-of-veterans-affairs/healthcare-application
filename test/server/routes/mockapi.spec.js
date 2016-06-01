'use strict'; // eslint-disable-line

const bodyParser = require('body-parser');
const express = require('express');
const request = require('supertest');

const mockapi = require('../../../src/server/routes/mockapi');

// Mock out the logger.
const options = { logger: { info: () => {} } };

describe('mock api', () => {
  describe('/resource1 with no mock set', () => {
    const app = express();
    app.use(bodyParser.json());
    app.use('/', mockapi(options));

    it('should return a 500 error', (done) => {
      request(app)
        .get('/resource1')
        .expect(500)
        .end(done);
    });
  });

  describe('/resource1 with mocked get', () => {
    let app = null;
    beforeEach((done) => {
      app = express();
      app.use(bodyParser.json());
      app.use('/', mockapi(options));

      request(app)
        .post('/mock')
        .send({ resource: 'resource1', value: { poopy: 1 } })
        .expect(200, done);
    });
    it('should return set value', (done) => {
      request(app)
        .get('/resource1')
        .expect(200)
        .expect({ poopy: 1 }, done);
    });
    it('should not affect unrelated verbs', (done) => {
      request(app)
        .post('/resource1')
        .expect(500, done);
    });
    it('should not affect unrelated resources', (done) => {
      request(app)
        .get('/resource2')
        .expect(500, done);
    });
  });

  describe('/resource1 with mocked post', () => {
    let app = null;
    beforeEach((done) => {
      app = express();
      app.use(bodyParser.json());
      app.use('/', mockapi(options));

      request(app)
        .post('/mock')
        .send({ resource: 'resource1', value: { stoopid: 1 }, verb: 'post' })
        .expect(200, done);
    });
    it('should return set value', (done) => {
      request(app)
        .post('/resource1')
        .expect(200)
        .expect({ stoopid: 1 }, done);
    });
  });

  describe('/resource1 using mixed case for the verb', () => {
    let app = null;
    beforeEach((done) => {
      app = express();
      app.use(bodyParser.json());
      app.use('/', mockapi(options));

      request(app)
        .post('/mock')
        .send({ resource: 'rEsOuRcE1', value: { grammmer: 42 }, verb: 'pUT' })
        .expect(200, done);
    });
    it('should return set value', (done) => {
      request(app)
        .put('/rEsOuRcE1')
        .expect(200)
        .expect({ grammmer: 42 }, done);
    });
  });
});

