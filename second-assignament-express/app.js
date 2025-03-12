const express = require('express');

const app = express();

app.use('/users', (req, res, next) => {
  console.log('This is the users Middleware');
  res.send('<h1>This is the Users Middleware!!</h1>');
});

app.use('/', (req, res, next) => {
  console.log('This is the home Middleware');
  res.send('<h1>This is the Home Middleware!!</h1>');
});

app.listen(3000);