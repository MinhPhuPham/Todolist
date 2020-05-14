'use strict';

import Todo from '../models/Todo';

module.exports = async (req, res, next) => {
  const { status, id } = req.query;
  const { id: user_id } = req.user_token;
  const conditions = {
    created_by: user_id
  };

  if (!isNaN(status)) {
    conditions.status = +status;
  }

  if (!isNaN(id)) {
    conditions.id = +id;
  }

  const todos = await Todo.find(conditions);

  return res.json({
    status: 'OK',
    data: todos
  });
};