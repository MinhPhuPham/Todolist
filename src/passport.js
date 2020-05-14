'use strict';

import passport from 'passport';
import passportJWT from 'passport-jwt';
import User from './models/User';

const ExtractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;

passport.use(new JwtStrategy(
  {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.SECRET,
    passReqToCallback: true
  },
  async (req, payload, next) => {
    const user = await User.findOne({
      email: payload.user_id,
      status: true
    })

    let user_token = {
      email: user.email,
      is_super_user: user.is_super_user
    }

    if (req.url.endsWith('logout')) {
      req.user_token = user_token;
      return next(null, payload);
    }
    else {
      if (!user_token) {
        return next(new Error('Token is invalid'));
      }
      req.user_token = user_token;
      return next(null, user_token);
    }
  }
));

module.exports = passport;