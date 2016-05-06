const express = require('express');
const route = express.Router(); // eslint-disable-line
route.route('/')
  .get((req, res) => {
    res.send('root route');
  })
  .post((req, res) => {
    res.status(501).end();
  });

module.exports = route;
