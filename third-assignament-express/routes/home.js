const express = require('express');
const path = require('path');

const router = express.Router();

const rootDir = require('../util/path');

router.get('/', (req, res, next) => {
  res.sendFile(path.join(rootDir, 'views', 'home.html'));
});

module.exports = router;