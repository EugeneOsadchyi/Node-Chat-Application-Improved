const express = require('express');

const router = express.Router();
const logger = require('winston');

const User = require('../models/user');

router.get('/', (req, res) => {
  res.render('login');
});

router.post('/', (req, res) => {
  const { email, password } = req.body;

  User.findByCredentials(email, password).then((user) => {
    req.session.user = user;
    res.redirect('/');
  }).catch((err) => {
    logger.log('error', err);

    res.flash('error', 'Email or password is invalid');
    res.redirect('/login');
  });
});

module.exports = router;
