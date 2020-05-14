'use strict';

const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  id: { type: Number, unique: true },
  content: { type: String },
  status: { type: Number, default: 0 },
  created_by: { type: Number },
  created_at: { type: Number },
  updated_at: { type: Number },
  completed_at: { type: Number }
});

module.exports = mongoose.model('Todo', schema, 'todos');