const mongoose = require('mongoose');

const { Schema } = mongoose;

const FileSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  path: {
    type: String,
    required: true,
    trim: true,
  },
});

module.exports = { FileSchema };
