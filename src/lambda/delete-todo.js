'use strict';
import moment from 'moment';

import User from '../models/User';

module.exports = async (req, res, next) => {
  const { id } = req.params;
  const { email } = req.user_token;

  if (!content) {
    return next('Missing parameter: content');
  }

  const user = await User.findOne({ email });

  let todo = user.todos.filter(todo => {
    return todo.id == id;
  });

  const now = moment().unix();
  await User.findOneAndUpdate({
    email,
  }, {
    ...user,
    todos: [
      ...user.todos,
      {
        ...todo,
        updated_at: now,
        status: -1
      }
    ]
  });

  return res.json({
    status: 'OK'
  })
};