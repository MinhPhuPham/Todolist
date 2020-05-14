
'use strict';
import moment from 'moment';

import Todo from '../models/Todo';

module.exports = async (req, res, next) => {
  const { id } = req.params;

  const { content, status } = req.body;
  const { id: user_id } = req.user_token;

  if (!content) {
    return next('Missing parameter: content');
  }

  if (isNaN(id)) {
    return next('Wrong parameter: id');
  }

  let set = {
    '$set': {
      content,
      updated_at: moment().unix()
    }
  };

  if (!isNaN(status)) {
    set['$set'].status = status;
  }


  await Todo.update({
    id: +id,
    created_by: user_id
  },
  set);

  let data = await Todo.findOne({
    id,
    created_by: user_id
  })

  return res.json({
    status: 'OK',
    data
  });
};