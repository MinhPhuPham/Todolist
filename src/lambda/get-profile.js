'use strict';

import User from '../models/User';

module.exports = async (req, res, next) => {
  const { id } = req.user_token;

  const user = await User.findOne({ id });

  return res.json({
    status: 'OK',
    data: user
    // {
    //     name: user.name,
    //     email:user.email,
    //     is_super_user,
    //     created_at
    // }
  });
};