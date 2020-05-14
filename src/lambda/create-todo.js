'use strict';
import moment from 'moment';

import User from '../models/User';

module.exports = async (req, res, next) => {
  const { content, status = true } = req.body;
  const { email } = req.user_token;

  if (!content) {
    return next('Missing parameter: content');
  }

  const user = await User.findOne({ email });

  const now = moment().unix();
  await User.findOneAndUpdate({
    email,
  }, {
    ...user,
    todos: [
      ...todos,
      {
        content,
        created_at: now,

      }
    ]
  })

  return res.json({
    status: 'OK'
  })
};