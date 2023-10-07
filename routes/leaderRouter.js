const express = require('express');
const bodyParser = require('body-parser');

const Leaders = require('../models/leaders');
const authenticate = require('../authenticate');

const leaderRouter = express.Router();
leaderRouter.use(bodyParser.json());

leaderRouter.route('/').all((request, response, next) => {
    response.statusCode = 200;
    response.setHeader('ContentType', 'text/plain');
    next();
}).get((request, response, next) => {
    Leaders.find({}).then((leaders) => {
        response.json(leaders);
    }, (err) => {
        next(err);
    }).catch((err) => {
        next(err);
    });
}).post(authenticate.verifyUser, authenticate.verifyAdmin, (request, response, next) => {
    Leaders.create(request.body).then((leader) => {
        response.statusCode = 201;
        response.json(leader);
    }, (err) => {
        next(err);
    }).catch((err) => {
        next(err);
    });
}).put(authenticate.verifyUser, authenticate.verifyAdmin, (request, response, next) => {
    response.statusCode = 403;
    response.end('PUT no tiene soporte para /leaders');
}).delete(authenticate.verifyUser, authenticate.verifyAdmin, (request, response, next) => {
    Leaders.deleteMany({}).then((resp) => {
        response.json(resp);
    }, (err) => {
        next(err);
    }).catch((err) => {
        next(err);
    });
})

leaderRouter.route('/:leaderId').get((request, response, next) => {
    Leaders.findById(request.params.leaderId).then((leader) => {
        response.json(leader);
    }, (err) => {
        next(err);
    }).catch((err) => {
        next(err);
    });
}).post(authenticate.verifyUser, authenticate.verifyAdmin, (request, response, next) => {
    response.statusCode = 403;
    response.end('POST no tiene soporte para /leaders/ ' + request.params.leaderId);
}).put(authenticate.verifyUser, authenticate.verifyAdmin, (request, response, next) => {
    Leaders.findByIdAndUpdate(request.params.leaderId, {
        $set: request.body,
    }, {new: true}).then((leader) => {
        response.json(leader);
    }, (err) => {
        next(err);
    }).catch((err) => {
        next(err);
    });
}).delete(authenticate.verifyUser, authenticate.verifyAdmin, (request, response, next) => {
    Leaders.findByIdAndRemove(request.params.leaderId).then((resp) => {
        response.json(resp);
    }, (err) => {
        next(err);
    }).catch((err) => {
        next(err);    
    });
});

module.exports = leaderRouter;
