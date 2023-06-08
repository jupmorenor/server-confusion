const express = require('express');
const bodyParser = require('body-parser'); 

const dishRouter = express.Router();
dishRouter.use(bodyParser.json());

dishRouter.route('/').all((request, response, next) => {
    response.statusCode = 200;
    response.setHeader('ContentType', 'text/plain');
    next();
}).get((request, response, next) => {
    response.end('Se enviarán todos los platillos.');
}).post((request, response, next) => {
    response.end('Se agregará un nuevo platillo: ' + request.body.name + ' con descripcion: ' + request.body.description);
}).put((request, response, next) => {
    response.statusCode = 403;
    response.end('PUT no tiene soporte para los platillos');
}).delete((request, response, next) => {
    response.end('Se borrarán todos los platillos.');
});

module.exports = dishRouter;
