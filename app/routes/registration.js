const _ = require('lodash');
const express = require('express');

const router = express.Router();
const logger = require('winston');

const User = require('../models/user');

router.get('/', (req, res) => {
  res.render('registration');
});

router.post('/', (req, res) => {
  const body = _.pick(req.body, ['email', 'name', 'password']);
  const newUser = new User(body);

  newUser.save().then((user) => {
    req.session.user = user;
    res.redirect('/');
  }).catch((err) => {
    logger.log('error', err);

    res.flash('error', err.message);
    res.status(400).redirect('./registration');
  });
});

module.exports = router;
