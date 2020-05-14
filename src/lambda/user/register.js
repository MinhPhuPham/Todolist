'use strict';

import moment from 'moment';

import { isValidEmail } from '../../helper/check-email';
import { isValidUserInfo } from '../../helper/check-user-info';
import User from '../../models/User';
import { generatePassword } from '../../helper/utils'; 

module.exports = async (req, res, next) => {
  const { name, email, password } = req.body;

  let isValid = isValidUserInfo(name, email, password);
  if (isValid.error) {
    return next(isValid.error);
  }

  isValid = await isValidEmail(email);

  if (!isValid) {
    return next('Wrong email address');
  }

  const { hash, salt } = generatePassword(password);

  const now = moment().unix();
  await User.insertMany([{
    name,
    email,
    hash,
    salt,
    todo: [],
    created_at: now,
    updated_at: now,
    tokens: []
  }]);

  return res.json({
    status: 'OK',
    data: {
      name,
      email
    }
  });
};