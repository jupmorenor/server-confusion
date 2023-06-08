const express = require('express');
const bodyParser = require('body-parser'); 

const promoRouter = express.Router();
promoRouter.use(bodyParser.json());

promoRouter.route('/').all((request, response, next) => {
    response.statusCode = 200;
    response.setHeader('ContentType', 'text/plain');
    next();
}).get((request, response, next) => {
    response.end('Se enviarán todas las promociones.');
}).post((request, response, next) => {
    response.end('Se agregará una nueva promocion: ' + request.body.name + ' con descripcion: ' + request.body.description);
}).put((request, response, next) => {
    response.statusCode = 403;
    response.end('PUT no tiene soporte para las promociones');
}).delete((request, response, next) => {
    response.end('Se borrarán todas las promociones.');
})

promoRouter.get('/:promoId', (request, response, next) => {
    response.end('Se enviarán detalles de la promocion ' + request.params.promoId);
});

promoRouter.post('/:promoId', (request, response, next) => {
    response.statusCode = 403;
    response.end('POST no tiene soporte para la promocion ' + request.params.promoId);
});

promoRouter.put('/:promoId', (request, response, next) => {
    response.write('Modificando la promocion: ' + request.params.promoId + '\n');
    response.end('Se modificará la promocion: ' + request.body.name + ' con descripcion: ' + request.body.description);
});

promoRouter.delete('/:promoId', (request, response, next) => {
    response.end('Borrando promocion ' + request.params.promoId);
});

module.exports = promoRouter;
