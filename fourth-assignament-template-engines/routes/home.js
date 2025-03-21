const express = require('express');
const path = require('path');

const router = express.Router();

const rootDir = require('../util/path');

router.get('/', (req, res, next) => {
  res.render('home', {pageTitle: 'Home', path: '/'})
});

module.exports = router;