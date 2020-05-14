import crypto from 'crypto';
const jwt = require('jsonwebtoken');

function generatePassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 10000, 512, 'sha512').toString('hex');
  return { salt, hash };
}

function validatePassword(password, user_salt, user_hash) {
  const hash = crypto.pbkdf2Sync(password, user_salt, 10000, 512, 'sha512').toString('hex');
  return user_hash === hash;
}

function generateJWT(user_token) {
  return jwt.sign(
    {
      user_id: user_token.email,
      is_super_user: user_token.is_super_user,
      exp: parseInt(user_token.expired_at)
    },
    process.env.SECRET
  );
}

module.exports = {
  generatePassword,
  validatePassword,
  generateJWT
};