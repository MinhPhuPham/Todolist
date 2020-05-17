
'use strict';
import moment from 'moment';

import Todo from '../models/Todo';

module.exports = async (req, res, next) => {
  const { id } = req.params;

  const { content, status, start_at , complete } = req.body;
  const { id: user_id } = req.user_token;

  if (isNaN(id)) {
    return next('Wrong parameter: id');
  }

  let set = {
    '$set': {
      updated_at: moment().unix()
    }
  };

  if (content) {
    set['$set'].content = content;
  }

  if (!isNaN(status)) {
    if (status > 2 || status < -1) {
      return next('Wrong parameter: status');
    }
    set['$set'].status = status;
  }

  if (!isNaN(complete)) {
    if (complete < moment().unix()) {
      return next('complete time have to greater than now');
    }
    set['$set'].complete = complete;
  }
  
  if (!isNaN(start_at)) {
    set['$set'].start_at = start_at;
  }
  
  await Todo.updateOne({
    id: +id,
    created_by: user_id
  },
  set);

  let data = await Todo.findOne({
    id,
    created_by: user_id
  });

  if (!data) {
    return next('todo is not existed');
  }

  return res.json({
    status: 'OK',
    data
  });
};