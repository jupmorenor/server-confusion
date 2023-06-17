const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Dishes = require('../models/dishes');

const dishRouter = express.Router();
dishRouter.use(bodyParser.json());

dishRouter.route('/').all((request, response, next) => {
    response.statusCode = 200;
    response.setHeader('ContentType', 'application/json');
    next();
}).get((request, response, next) => {
    Dishes.find({}).then((dishes) => {
        response.json(dishes);
    }, (err) => {
        next(err);
    }).catch((err) => {
        next(err);
    });
}).post((request, response, next) => {
    Dishes.create(request.body).then((dish) => {
        console.log('Dish creado', dish)
        response.statusCode = 201;
        response.json(dish);
    }, (err) => {
        next(err);
    }).catch((err) => {
        next(err);    
    });
}).put((request, response, next) => {
    response.statusCode = 403;
    response.end('PUT no tiene soporte para los platillos');
}).delete((request, response, next) => {
    Dishes.deleteMany({}).then((resp) => {
        response.json(resp);
    }, (err) => {
        next(err);
    }).catch((err) => {
        next(err);    
    });
});

dishRouter.get('/:dishId', (request, response, next) => {
    Dishes.findById(request.params.dishId).then((dish) => {
        response.json(dish);
    }, (err) => {
        next(err);
    }).catch((err) => {
        next(err);
    });
});

dishRouter.post('/:dishId', (request, response, next) => {
    response.statusCode = 403;
    response.end('POST no tiene soporte para el platillo ' + request.params.dishId);
});

dishRouter.put('/:dishId', (request, response, next) => {
    Dishes.findByIdAndUpdate(request.params.dishId, {
        $set: request.body,
    }, {new: true}).then((dish) => {
        response.json(dish);
    }, (err) => {
        next(err);
    }).catch((err) => {
        next(err);
    });
});

dishRouter.delete('/:dishId', (request, response, next) => {
    Dishes.findByIdAndRemove(request.params.dishId).then((resp) => {
        response.json(resp);
    }, (err) => {
        next(err);
    }).catch((err) => {
        next(err);    
    });
});

module.exports = dishRouter;
