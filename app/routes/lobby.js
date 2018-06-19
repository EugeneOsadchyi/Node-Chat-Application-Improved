const express = require('express');

const router = express.Router();
const logger = require('winston');

const Room = require('../models/room');

router.get('/', (req, res) => {
  Room.find().then((rooms) => {
    res.render('lobby', { rooms });
  }).catch((err) => {
    logger.log('error', err);
    res.flash('error', `Something went wrong: ${err.message}`);
    res.render('lobby', { rooms: [] });
  });
});

module.exports = router;
