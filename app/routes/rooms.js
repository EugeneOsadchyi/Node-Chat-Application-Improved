const express = require('express');

const router = express.Router();
const logger = require('winston');

const Room = require('../models/room');

router.post('/', (req, res) => {
  const { name } = req.body;
  const room = new Room({ name });

  room.save().then((doc) => {
    res.redirect(`/chat/${doc._id}`);
  })
    .catch((err) => {
      logger.log('error', err);

      res.flash('error', err.message);
      res.redirect('/lobby');
    });
});

module.exports = router;
