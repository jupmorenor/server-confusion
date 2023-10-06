const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');

const User = require('../models/user');
const authenticate = require('../authenticate');

const router = express.Router();
router.use(bodyParser.json());

const sendAuthError = (next, message, code) => {
  var err = new Error(message);
  response.setHeader('WWW-Authenticate', 'Basic');
  err.status = code;
  return next(err);
}

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/signup', (request, response, next) => {
  User.register(new User({username: request.body.username}), request.body.password, (err, user) => {
    if (err) {
      response.statusCode = 500;
      response.setHeader('ContentType', 'Application/json');
      response.json({err: err});
    } else {
      if (request.body.firstname) {
        user.firstname = request.body.firstname;
      }
      if (request.body.lastname) {
        user.lastname = request.body.lastname;
      }
      user.save((err, user) => {
        if (err) {
          response.statusCode = 500;
          response.setHeader('ContentType', 'Application/json');
          response.json({err: err});
        } else {
          passport.authenticate('local')(request, response, () => {
            response.statusCode = 201;
            response.setHeader('ContentType', 'Application/json');
            response.json({status: 'Registro exitoso', success: true});
          });
        }
      })
    }
  });
});

router.post('/login', passport.authenticate('local'), (request, response) => {
  const token = authenticate.getToken({_id: request.user._id})

  response.statusCode = 201;
  response.setHeader('ContentType', 'Application/json');
  response.json({status: 'Ha sido autenticado', success: true, token: token});

});

router.get('/logout', (request, response, next) =>{
  if (request.session) {
    request.session.destroy();
    response.clearCookie('session-id');
    response.redirect('/');
  } else {
    return sendAuthError(next, 'No se encuentra autenticado', 401);
  }
});

module.exports = router;
