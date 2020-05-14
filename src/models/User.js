'use strict';

const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  name: { type: String, trim: true },
  email: { type: String, trim: true, unique: true, index: true },
  hash: { type: String, trim: true },
  salt: { type: String, trim: true },
  token: { type: String },
  created_at: { type: Number },
  updated_at: { type: Number },
  last_login: { type: Number },
  is_super_user: { type: Boolean, default: false },
  status: { type: Boolean, default: true }
});

module.exports = mongoose.model('User', schema, 'user');