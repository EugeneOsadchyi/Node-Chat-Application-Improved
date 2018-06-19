const mongoose = require('mongoose');

const { Schema } = mongoose;

const { MessageSchema } = require('./message');

const RoomSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: [3, 'Room name should be at least 3 characters long'],
    unique: true,
  },
  messages: [MessageSchema],
});

const Room = mongoose.model('Room', RoomSchema);

module.exports = Room;
