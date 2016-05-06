const express = require('express');
const route = express.Router(); // eslint-disable-line
route.route('/')
  .get((req, res) => {
    res.send('api route');
  })
  .post((req, res) => {
    res.status(501).end();
  });

module.exports = route;
