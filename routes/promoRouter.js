const express = require('express');
const bodyParser = require('body-parser');

const Promotions = require('../models/promotions');

const promoRouter = express.Router();
promoRouter.use(bodyParser.json());

promoRouter.route('/').all((request, response, next) => {
    response.statusCode = 200;
    response.setHeader('ContentType', 'text/plain');
    next();
}).get((request, response, next) => {
    Promotions.find({}).then((promos) => {
        response.json(promos);
    }, (err) => {
        next(err);
    }).catch((err) => {
        next(err);
    });
}).post((request, response, next) => {
    Promotions.create(request.body).then((promo) => {
        console.log('Promo creada', promo)
        response.statusCode = 201;
        response.json(promo);
    }, (err) => {
        next(err);
    }).catch((err) => {
        next(err);
    });
}).put((request, response, next) => {
    response.statusCode = 403;
    response.end('PUT no tiene soporte para /promotions');
}).delete((request, response, next) => {
    Promotions.deleteMany({}).then((resp) => {
        response.json(resp);
    }, (err) => {
        next(err);
    }).catch((err) => {
        next(err);
    });
})

promoRouter.route('/:promoId').get((request, response, next) => {
    Promotions.findById(request.params.promoId).then((promo) => {
        response.json(promo);
    }, (err) => {
        next(err);
    }).catch((err) => {
        next(err);
    });
}).post((request, response, next) => {
    response.statusCode = 403;
    response.end('POST no tiene soporte para /promotions/ ' + request.params.promoId);
}).put((request, response, next) => {
    Promotions.findByIdAndUpdate(request.params.promoId, {
        $set: request.body,
    }, {new: true}).then((promo) => {
        response.json(promo);
    }, (err) => {
        next(err);
    }).catch((err) => {
        next(err);
    });
}).delete((request, response, next) => {
    Promotions.findByIdAndRemove(request.params.promoId).then((resp) => {
        response.json(resp);
    }, (err) => {
        next(err);
    }).catch((err) => {
        next(err);    
    });
});

module.exports = promoRouter;
