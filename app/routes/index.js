const express = require('express');

const router = express.Router();
const logger = require('winston');

const auth = require('../middleware/authenticate');

router.use('/login', require('./login'));
router.use('/registration', require('./registration'));
router.use('/lobby', auth, require('./lobby'));
router.use('/rooms', auth, require('./rooms'));
router.use('/chat', auth, require('./chat'));

router.get('/', auth, (req, res) => {
  res.redirect('/lobby');
});

router.get('/logout', auth, (req, res) => {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        logger.log('error', err);

        res.flash('error', err.message);
        res.redirect('./');
      } else {
        res.redirect('/login');
      }
    });
  }
});

module.exports = router;
