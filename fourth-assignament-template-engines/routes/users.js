const express = require('express');
const path = require('path');

const router = express.Router();

const users = [];

router.get('/', (req, res, next) => {
  res.render('users', {pageTitle: 'List of Users', path: '/users', users })
});

router.post('/new-user', (req, res, next) => {
  console.log('New user: ', req.body.user)
  console.log('All users');
  console.log(users);
  users.push({user: req.body.user})
  res.redirect('/');
});

exports.router = router;
exports.users = users;