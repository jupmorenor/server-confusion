const express = require('express');
const bodyParser = require('body-parser'); 

const leaderRouter = express.Router();
leaderRouter.use(bodyParser.json());

leaderRouter.route('/').all((request, response, next) => {
    response.statusCode = 200;
    response.setHeader('ContentType', 'text/plain');
    next();
}).get((request, response, next) => {
    response.end('Se enviarán todos los lideres.');
}).post((request, response, next) => {
    response.end('Se agregará un nuevo lider: ' + request.body.name + ' con descripcion: ' + request.body.description);
}).put((request, response, next) => {
    response.statusCode = 403;
    response.end('PUT no tiene soporte para los lideres');
}).delete((request, response, next) => {
    response.end('Se borrarán todos los lideres.');
});

leaderRouter.get('/:leaderId', (request, response, next) => {
    response.end('Se enviarán detalles del lider ' + request.params.leaderId);
});

leaderRouter.post('/:leaderId', (request, response, next) => {
    response.statusCode = 403;
    response.end('POST no tiene soporte para el lider ' + request.params.leaderId);
});

leaderRouter.put('/:leaderId', (request, response, next) => {
    response.write('Modificando el lider: ' + request.params.leaderId + '\n');
    response.end('Se modificará el lider: ' + request.body.name + ' con descripcion: ' + request.body.description);
});

leaderRouter.delete('/:leaderId', (request, response, next) => {
    response.end('Borrando lider ' + request.params.leaderId);
});

module.exports = leaderRouter;
