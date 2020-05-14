'use strict';

const verifier = require('email-verify');

function isValidEmail(email) {
  return new Promise((resolve, reject) => {
    verifier.verify(email, (err, info) => {
      if (err) {
        reject(err);
      } else {
        resolve(info.success);
      }
    });
  });
}

module.exports = {
  isValidEmail
};