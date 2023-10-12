const express = require('express');
const bodyParser = require('body-parser');
const cors = require('./cors');
const Favorites = require('../models/favorites');
const authenticate = require('../authenticate');

const favoriteRouter = express.Router();
favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/').all((request, response, next) => {
    response.statusCode = 200;
    response.setHeader('ContentType', 'application/json');
    next();
}).options(cors.corsWithOptions, (req, res) => { res.sendStatus(200) })
.get(cors.corsWithOptions, authenticate.verifyUser, (request, response, next) => {
    Favorites.findOne({user: request.user._id}).populate('user').populate('dishes').then((favs) => {
        response.json(favs);
    }, (err) => {
        next(err);
    }).catch((err) => {
        next(err);
    });
}).post(cors.corsWithOptions, authenticate.verifyUser, (request, response, next) => {
    Favorites.findOne({user: request.user._id}).then((favs) => {
        if (favs !== null) {
            request.body.forEach((dish) => {
                if (favs.dishes.indexOf(dish._id) === -1) {
                    favs.dishes.push(dish._id);
                }
            });
            favs.save().then((favsC) => {
                response.statusCode = 201;
                response.json(favsC);
            }, err => next(err));
        } else {
            favs = new Favorites({user: request.user._id});
            favs.save().then((newfav) => {
                request.body.forEach((dish) => {
                    if (newfav.dishes.indexOf(dish._id) === -1) {
                        newfav.dishes.push(dish._id);
                    }
                });
                newfav.save().then((favsC) => {
                    response.statusCode = 201;
                    response.json(favsC);
                }, err => next(err));
            }, err => next(err));
        }
    }, (err) => {
        next(err);
    }).catch((err) => {
        next(err);    
    });
}).delete(cors.corsWithOptions, authenticate.verifyUser, (request, response, next) => {
    Favorites.findOneAndDelete({user: request.user._id}).then((favs) => {
        response.json(favs);
    }, (err) => {
        next(err);
    }).catch((err) => {
        next(err);    
    });
});

favoriteRouter.route('/:dishId').options(cors.corsWithOptions, (req, res) => { res.sendStatus(200) })
.post(cors.corsWithOptions, authenticate.verifyUser, (request, response, next) => {
    Favorites.findOne({user: request.user._id}).then((favs) => {
        if (favs !== null) {
            if (favs.dishes.indexOf(request.params.dishId) === -1) {
                favs.dishes.push(request.params.dishId);
                favs.save().then((favsC) => {
                    response.statusCode = 201;
                    response.json(favsC);
                }, err => next(err));
            } else {
                response.statusCode = 200;
                response.json(favs);
            }
        } else {
            favs = new Favorites({user: request.user._id});
            favs.save().then((newfav) => {
                newfav.dishes.push(request.params.dishId);
                newfav.save().then((err, favsC) => {
                    if (err) {
                        response.statusCode = 500;
                        response.json({ err: err });
                    }
                    response.statusCode = 201;
                    response.json(favsC);
                }, err => next(err));
            }, err => next(err));
        }
    }, (err) => {
        next(err);
    }).catch((err) => {
        next(err);    
    });
}).delete(cors.corsWithOptions, authenticate.verifyUser, (request, response, next) => {
    Favorites.findOne({user: request.user._id}).then((favs) => {
        if (favs === null) {
            err = new Error('Favorites for the user ' + request.user.username + ' not found');
            err.status = 404;
            return next(err);
        } else {
            const idx = favs.dishes.indexOf(request.params.dishId);
            if (idx !== -1) {
                favs.dishes.splice(idx, 1);
                favs.save().then((favsC) => {
                    response.statusCode = 200;
                    response.json(favsC);
                }, err => next(err));
            } else {
                response.statusCode = 200;
                response.json(favs);
            }
        }
    }, (err) => {
        next(err);
    }).catch((err) => {
        next(err);    
    });
});

module.exports = favoriteRouter;
