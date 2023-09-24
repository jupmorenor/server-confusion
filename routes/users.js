const express = require('express');
const bodyParser = require('body-parser');

const Users = require('../models/user');

const router = express.Router();
router.use(bodyParser.json());

const sendAuthError = (next, message) => {
  var err = new Error(message);
  response.setHeader('WWW-Authenticate', 'Basic');
  err.status = 401;
  return next(err);
}

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/signup', (request, response, next) => {
  Users.findOne({username: request.body.username}).then((user) => {
    if (user !== null) {
      var err = new Error(`El usuario ${request.body.username} ya existe`);
      err.status = 401;
      next(err);
    } else {
      return Users.create({
        username: request.body.username,
        password: request.body.password,
      });
    }
  }).then((user) => {
    response.statusCode = 201;
    response.setHeader('ContentType', 'Application/json');
    response.json({status: 'Registro exitoso', user: user});
  }, (err) => {
    next(err);
  }).catch((err) => {
    next(err);
  });
});

router.post('/login', (request, response, next) => {

  if (!request.session.user) {
    var authHeader = request.headers.authorization;
    if (!authHeader) {
      return sendAuthError(next, 'No se ha autenticado!!');
    }
  
    var auth = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
    var username = auth[0];
    var pass = auth[1];
  
    Users.findOne({username: username}).then((user) => {
      if (user === null) {
        return sendAuthError(next, 'Usuario ' + username + ' no existe!!');
      } else if (user.password !== pass) {
        return sendAuthError(next, 'Contraseña incorrecta!!');
      } else if (user.username === username && user.password === pass) {
        // response.cookie('user', 'admin', {signed: true})
        request.session.user = 'authenticated';
        response.statusCode = 200;
        response.setHeader('ContentType', 'text/plain');
        response.end('Ha sido autenticado');
      }
    }).catch((err) => {
      next(err);
    })
  } else {
    response.statusCode = 200;
    response.setHeader('ContentType', 'text/plain');
    response.end('Ya se encontraba autenticado');
  }
});

router.get('/logout', (request, response, next) =>{
  if (request.session) {
    request.session.destroy();
    response.clearCookie('session-id');
    response.redirect('/');
  } else {
    return sendAuthError(next, 'No se encuentra autenticado');
  }
});

module.exports = router;
