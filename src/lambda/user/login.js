'use strict';

import moment from 'moment';

import { isValidUserInfo } from '../../helper/check-user-info';
import User from '../../models/User';
import { validatePassword, generateJWT } from '../../helper/utils';

module.exports = async (req, res, next) => {
  const { email, password } = req.body;

  let isValid = isValidUserInfo('_', email, password);
  if (isValid.error) {
    return next(isValid.error);
  }

  const user = await User.findOne({ email });

  if (!user) {
    return next('Wrong user or password');
  }

  if (!validatePassword(password, user.salt, user.hash)) {
    return next('Wrong user or password');
  }

  const now = moment().unix();
  const token = generateJWT({ email: user.email, is_super_user:user.is_super_user, expired_at: now + 30 * 3600 * 24});
  user = await User.findOneAndUpdate({ email }, {
    ...user,
    token,
    updated_at: now
  });
  return res.json({
    status: 'OK',
    data: {
      name: user.name,
      email: user.email,
      todos: user.todos,
      token: user.token
    }
  });
};