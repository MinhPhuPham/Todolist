
'use strict';
import moment from 'moment';

import User from '../models/User';

module.exports = async (req, res, next) => {
  const id = req.params;
  const { content, status } = req.body;
  const { email } = req.user_token;

  if (!content) {
    return next('Missing parameter: content');
  }

  const user = await User.findOne({ email });
  const todo = user.todos.filter(todo => {
    return todo.id === id;
  });

  const now = moment().unix();
  await User.findOneAndUpdate({
    email,
  }, {
    ...user,
    todos: [
      ...todos,
      {
        ...todo,
        content,
        updated_at: now,
        completed_at: status ? now : undefined,
        status: status ? 1 : 0
      }
    ]
  })

  return res.json({
    status: 'OK'
  })
};