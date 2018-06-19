const express = require('express');

const router = express.Router();
const logger = require('winston');

const Room = require('../models/room');

router.get('/:id', (req, res) => {
  const roomId = req.params.id;

  Room.findOne({ _id: roomId }).then((room) => {
    if (!room) {
      res.flash('error', 'Room does not exist');
      res.redirect('/lobby');
    }

    req.session.roomId = room._id;
    res.render('chat');
  }).catch((err) => {
    logger.log('error', err);

    res.flash('error', `Something went wrong: ${err.message}`);
    res.redirect('/lobby');
  });
});

module.exports = router;
