'use strict';
import moment from 'moment';

import User from '../models/User';

module.exports = async (req, res, next) => {
  const { email } = req.user_token;

  const user = await User.findOne({ email });

  return res.json({
    status: 'OK',
    data: user.todos
  });
};