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

  let user = await User.findOne({ email });

  if (!user) {
    return next('Wrong user or password');
  }

  if (!validatePassword(password, user.salt, user.hash)) {
    return next('Wrong user or password');
  }

  const now = moment().unix();
  const info = {
    email: user.email,
    id: user.id,
    is_super_user: user.is_super_user,
    expired_at: now + 14 * 3600 * 24
  };
  
  const token = generateJWT(info);

  await User.updateOne({ email },
    {
      '$set': {
        token,
        updated_at: moment().unix()
      }
    }
  );

  return res.json({
    status: 'OK',
    data: {
      name: user.name,
      email,
      token
    }
  });
};