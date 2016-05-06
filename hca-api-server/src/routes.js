const express = require('express');
const router = express.Router(); // eslint-disable-line
const base = require('../routes/base');
const api = require('../routes/api');

router.use('/', base);
router.use('/api', api);

module.exports = router;
