const mongoose = require('mongoose');
const _ = require('lodash');

const { Schema } = mongoose;

const { FileSchema } = require('./file');

const MessageSchema = new Schema({
  text: {
    type: String,
    trim: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  file: FileSchema,
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

const Message = mongoose.model('Message', MessageSchema);

module.exports = {
  Message,
  MessageSchema,
};
