'use strict';

const Joi = require('@hapi/joi');

function isValidUserInfo(email, password) {
  const schema = Joi.object().keys({
    name:  Joi.string(),
    email: Joi.string()
      .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
    password: Joi.string()
      .pattern(new RegExp('^[a-zA-Z0-9]{8,30}$'))
  });
  let result = schema.validate({ name, email, password });
  if (result.error) {
    return {
      error: result.error.details[0].message
    }
  }

  return result.error ? result.error.details[0].message : {};
}

module.exports = {
  isValidUserInfo
};