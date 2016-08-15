const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const basicAuth = require('basic-auth');
const routes = require('./routes/index');
const questions = require('./routes/questions');
const cookieSession = require('cookie-session');

const app = express();

app.use(cookieSession({
  name: 'session',
  secret: 'foobar',
}));

if (app.get('env') === 'development') {
  app.locals.pretty = true;
}

app.all('/admin', (req, res, next) => {
  const unauthorized = (response) => {
    response.set('WWW-Authenticate', 'Basic realm=Authorization Required');
    return res.send(401);
  };

  const user = basicAuth(req);

  if (!user || !user.name || !user.pass) {
    return unauthorized(res);
  }

  if (user.name === 'admin' && user.pass === 'password') {
    return next();
  }
  return unauthorized(res);
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
// app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

app.get('/admin', (req, res) => {
  res.redirect('/admin/questions');
});

app.use('/admin/questions', questions);


// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
// no stacktraces leaked to user unless in development environment
app.use((err, req, res) => {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: (app.get('env') === 'development') ? err : {},
  });
});


module.exports = app;

