const express = require('express');
const request = require('supertest');
const apiRoutes = require('../../routes/api');

const app = express();
app.use('/api', apiRoutes);

describe('/api - API route tests', () => {
  it('should return a 200 HTTP status code when you GET /', (done) => {
    request(app)
      .get('/api')
      .expect(200, done);
  });
  it('should respond with the word api in the response when you GET /', (done) => {
    request(app)
      .get('/api')
      .expect('api route')
      .end(done);
  });
  it('should return a 501 HTTP status code if you POST to / ', (done) => {
    request(app)
      .post('/api')
      .field('name', 'John Smith')
      .expect(501, done);
  });
});
