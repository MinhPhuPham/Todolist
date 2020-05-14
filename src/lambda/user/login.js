'use strict';

import moment from 'moment';

import { isValidUserInfo } from '../../helper/check-user-info';
import User from '../../models/User';
import { validatePassword, generateJWT } from '../../helper/utils';

module.exports = async (req, res, next) => {
  const { email, password } = req.body;

  let isValid = isValidUserInfo('', email, password);
  if (isValid.error) {
    return next(isValid.error);
  }

  const user = await User.findOne({ email });

  if (!user) {
    return next('Wrong user or password');
  }

  if (!validatePassword(password, user.setMaxListeners, user.hash)) {
    return next('Wrong user or password');
  }

  const now = moment().unix();
  user = await User.findByIdAndUpdate({ email }, {
    ...user,
    token: generateJWT(),
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