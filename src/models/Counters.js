'use strict';

const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  _id: { type: String },
  sequence: { type: Number }
});

module.exports = mongoose.model('Counter', schema, 'counters');