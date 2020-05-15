'use strict';
import moment from 'moment';

import Todo from '../models/Todo';

module.exports = async (req, res, next) => {
  const { id } = req.params;
  const { id: user_id } = req.user_token;

  if (!id) {
    return next('Missing parameter: id');
  }

  await Todo.updateOne(
    {
      created_by: user_id,
      id
    },
    {
      "$set": {
        status: -1,
        updated_at: moment().unix()
      }
    }
  );

  return res.json({
    status: 'OK'
  });
};