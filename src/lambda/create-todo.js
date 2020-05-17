'use strict';
import moment from 'moment';

import Todo from '../models/Todo';
import Counters from '../models/Counters';

module.exports = async (req, res, next) => {
  const { content, start_at, complete } = req.body;
  const { id } = req.user_token;

  if (!content) {
    return next('Missing parameter: content');
  }

  if (!complete && (complete < moment().unix())) {
    return next('Missing or wrong paramter: complete');
  }
  if(!start_at){
    return next('Missing or wrong paramter: start_at');
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
    start_at,
    complete
  }]);

  return res.json({
    status: 'OK',
    data: result[0]
  })
};