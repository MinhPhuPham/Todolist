'use strict';
import moment from 'moment';

import Todo from '../models/Todo';
import Counters from '../models/Counters';

module.exports = async (req, res, next) => {
  const { content, complete } = req.body;
  const { id } = req.user_token;

  if (!content) {
    return next('Missing parameter: content');
  }

  if (!complete && !+complete) {
    return next('Missing or missing paramter: complete');
  }

  const counter = await Counters.findOneAndUpdate(
    { _id: 'todos'}, 
    { $inc: { sequence: 1 } },
    { new: true, upsert: true }
  );

  let result = await Todo.insertMany([{
    id: counter.sequence,
    content,
    created_by: id,
    created_at: moment().unix(),
    complete
  }]);

  return res.json({
    status: 'OK',
    data: result[0]
  })
};