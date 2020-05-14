'use strict';

const app = require('router')();
const body = require('body-parser');
const passport = require('./passport');

require('../mongooseFile');

app.use(body.json({ limit: '50mb' }));
app.use(require('./mid/query'));
app.use(require('./mid/json'));
app.use(passport.initialize());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, OPTIONS, PUT, PATCH, DELETE'
  );
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-Requested-With, Content-Type, Authorization'
  );
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

const ensureLogged = passport.authenticate('jwt', { session: false });

const ensureAdmin = async (req, res, next) => {
  if (!req.user_token) {
    return next(new Error('wrong token'));
  }
  if (!req.user_token.is_super_user) {
    return next(new Error('Require Admin'));
  }
  next();
};

app.get('/', require('./lambda/status'));

app.post('/register', require('./lambda/user/register'))
app.post('/login', require('./lambda/user/login'));

app.post('/todo', ensureLogged, require('./lambda/create-todo'));
app.get('/todos', ensureLogged, require('./lambda/get-todos'));
app.put('/todo/:id', ensureLogged, require('./lambda/update-todo'));
app.delete('/todo/:id', ensureLogged, require('./lambda/delete-todo'));

app.use(async (err, req, res, next) => {
  let error_code = err && err.message == 'Token is invalid' ? 4001 : undefined;

  if (!res.statusCode || res.statusCode === 200) {
    res.statusCode = 400;
  }
  if (error_code == 4001) {
    res.statusCode = 401;
  }

  let data = {
    status: 'FAIL',
    reason: err.message ? err.message : err.toString(),
    error_code
  };
  res.json(data);
});

module.exports = app;
