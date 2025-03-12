const express = require('express');
const path = require('path');

const router = express.Router();

const rootDir = require('../util/path');

router.get('/', (req, res, next) => {
  res.sendFile(path.join(rootDir, 'views', 'users.html'));
});

router.post('/new-user', (req, res, next) => {
  console.log(req.body);
  res.redirect('/');
});

module.exports = router;