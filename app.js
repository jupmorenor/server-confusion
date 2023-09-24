const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const FileStore = require('session-file-store')(session);

const indexRouter = require('./routes/index');
const users = require('./routes/users');
const dishRouter = require('./routes/dishRouter');
const promoRouter = require('./routes/promoRouter');
const leaderRouter = require('./routes/leaderRouter');

const mongoose = require('mongoose');

const url = 'mongodb://localhost:27017/conFusion';
const connect = mongoose.connect(url);

connect.then((db) => {
  console.log('Conectado correctamente.');
}, (err) => {
  console.log(err, 'No Conectado.');
});

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//app.use(cookieParser('asdfghjkl-qwertyuiop-zxcvbnm-135792468'));
app.use(session({
  name: 'session-id',
  secret: 'asdfghjkl-qwertyuiop-zxcvbnm-135792468',
  saveUninitialized: false,
  resave: false,
  store: new FileStore(),
}));

app.use('/', indexRouter);
app.use('/users', users);

function auth(request, response, next) {
  console.log(request.session);

  function sendAuthError(next, message) {
    var err = new Error(message);
    err.status = 401;
    return next(err);
  }

  if (!request.session.user) {
    return sendAuthError(next, 'No se ha autenticado!!');
  } else {
    if (request.session.user === 'authenticated') {
      next();
    } else {
      return sendAuthError(next, 'No tiene permiso para acceder!!');
    }
  }

}

app.use(auth);
app.use(express.static(path.join(__dirname, 'public')));

app.use('/dishes', dishRouter);
app.use('/promotions', promoRouter);
app.use('/leaders', leaderRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
