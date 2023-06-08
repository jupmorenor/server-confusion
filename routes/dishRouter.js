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

dishRouter.get('/:dishId', (request, response, next) => {
    response.end('Se enviarán detalles del platillo ' + request.params.dishId);
});

dishRouter.post('/:dishId', (request, response, next) => {
    response.statusCode = 403;
    response.end('POST no tiene soporte para el platillo ' + request.params.dishId);
});

dishRouter.put('/:dishId', (request, response, next) => {
    response.write('Modificando el platillo: ' + request.params.dishId + '\n');
    response.end('Se modificará el platillo: ' + request.body.name + ' con descripcion: ' + request.body.description);
});

dishRouter.delete('/:dishId', (request, response, next) => {
    response.end('Borrando platillo ' + request.params.dishId);
});

module.exports = dishRouter;
