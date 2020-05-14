'use strict';

import Todo from '../models/Todo';

module.exports = async (req, res, next) => {
  const { id } = req.user_token;

  const todos = await Todo.find({ created_by: id });

  return res.json({
    status: 'OK',
    data: todos
  });
};