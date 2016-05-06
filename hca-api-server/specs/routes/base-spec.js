
const assert = require('assert');
const express = require('express');
const request = require('supertest');
const baseRoutes = require('../../routes/base');

const app = express();
app.use('/', baseRoutes);

describe('sanity check test suite', () => {
  it('should have 1 equal to 1', () => {
    assert.equal(1, 1, 'test 1 = 1');
  });
});

describe('/ - base route tests', () => {
  it('should return a 200 HTTP status code when you GET /', (done) => {
    request(app)
      .get('/')
      .expect(200, done);
  });
  it('should respond with the word root in the response when you GET /', (done) => {
    request(app)
      .get('/')
      .expect('root route')
      .end(done);
  });
  it('should return a 501 HTTP status code if you POST to / ', (done) => {
    request(app)
      .post('/')
      .field('name', 'Doctor Who')
      .expect(501, done);
  });
});
