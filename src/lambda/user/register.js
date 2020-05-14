'use strict';

import moment from 'moment';

import { isValidEmail } from '../../helper/check-email';
import { isValidUserInfo } from '../../helper/check-user-info';
import { generatePassword } from '../../helper/utils'; 
import User from '../../models/User';
import Counters from '../../models/Counters';

module.exports = async (req, res, next) => {
  const { 
    name = '',
    email = '',
    password = ''
  } = req.body;

  let isValid = isValidUserInfo(name, email, password);
  if (isValid.error) {
    return next(isValid.error);
  }

  isValid = await isValidEmail(email);

  if (!isValid) {
    return next('Wrong email address');
  }

  const user = await User.findOne({ email });
  if (user) {
    return next('User is existed');
  }

  const { hash, salt } = generatePassword(password);
  const counter = await Counters.findOneAndUpdate(
    { _id: 'users'}, 
    { $inc: { sequence: 1 } },
    { new: true, upsert: true }
  );

  const now = moment().unix();
  await User.insertMany([{
    id: counter.sequence,
    name,
    email,
    hash,
    salt,
    created_at: now,
    updated_at: now
  }]);

  return res.json({
    status: 'OK',
    data: {
      name,
      email
    }
  });
};