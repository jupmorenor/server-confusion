const express = require('express');
const bodyParser = require('body-parser');
const cors = require('./cors');
const Dishes = require('../models/dishes');
const authenticate = require('../authenticate');

const dishRouter = express.Router();
dishRouter.use(bodyParser.json());

dishRouter.route('/').all((request, response, next) => {
    response.statusCode = 200;
    response.setHeader('ContentType', 'application/json');
    next();
}).options(cors.corsWithOptions, (req, res) => { res.sendStatus(200) })
.get(cors.cors, (request, response, next) => {
    Dishes.find({}).populate('comments.author')
    .then((dishes) => {
        response.json(dishes);
    }, (err) => {
        next(err);
    }).catch((err) => {
        next(err);
    });
}).post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (request, response, next) => {
    Dishes.create(request.body).then((dish) => {
        response.statusCode = 201;
        response.json(dish);
    }, (err) => {
        next(err);
    }).catch((err) => {
        next(err);    
    });
}).put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (request, response, next) => {
    response.statusCode = 403;
    response.end('PUT no tiene soporte para /dishes');
}).delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (request, response, next) => {
    Dishes.deleteMany({}).then((resp) => {
        response.json(resp);
    }, (err) => {
        next(err);
    }).catch((err) => {
        next(err);    
    });
});

dishRouter.route('/:dishId').options(cors.corsWithOptions, (req, res) => { res.sendStatus(200) })
.get(cors.cors, (request, response, next) => {
    Dishes.findById(request.params.dishId).populate('comments.author')
    .then((dish) => {
        response.json(dish);
    }, (err) => {
        next(err);
    }).catch((err) => {
        next(err);
    });
}).post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (request, response, next) => {
    response.statusCode = 403;
    response.end('POST no tiene soporte para /dishes/ ' + request.params.dishId);
}).put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (request, response, next) => {
    Dishes.findByIdAndUpdate(request.params.dishId, {
        $set: request.body,
    }, {new: true}).then((dish) => {
        response.json(dish);
    }, (err) => {
        next(err);
    }).catch((err) => {
        next(err);
    });
}).delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (request, response, next) => {
    Dishes.findByIdAndRemove(request.params.dishId).then((resp) => {
        response.json(resp);
    }, (err) => {
        next(err);
    }).catch((err) => {
        next(err);    
    });
});

dishRouter.route('/:dishId/comments').options(cors.corsWithOptions, (req, res) => { res.sendStatus(200) })
.get(cors.cors, (request, response, next) => {
    Dishes.findById(request.params.dishId).populate('comments.author')
    .then((dish) => {
        if (dish !== null) {
            response.json(dish.comments);
        } else {
            err = new Error('Dish ' + request.params.dishId + 'not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => {
        next(err);
    }).catch((err) => {
        next(err);
    });
}).post(cors.corsWithOptions, authenticate.verifyUser, (request, response, next) => {
    Dishes.findById(request.params.dishId).then((dish) => {
        if (dish !== null) {
            request.body.author = request.user._id;
            dish.comments.push(request.body);
            dish.save().then((dishC) => {
                Dishes.findById(dishC._id).populate('comments.author').then((fullDish) => {
                    response.statusCode = 201;
                    response.json(fullDish);
                });
            });
        } else {
            err = new Error('Dish ' + request.params.dishId + 'not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => {
        next(err);
    }).catch((err) => {
        next(err);    
    });
}).put(cors.corsWithOptions, authenticate.verifyUser, (request, response, next) => {
    response.statusCode = 403;
    response.end('PUT no tiene soporte para /dishes/' + request.params.dishId + '/comments');
}).delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (request, response, next) => {
    Dishes.findById(request.params.dishId).then((dish) => {
        if (dish !== null) {
            for (let i = dish.comments.length-1; i >= 0; i--) {
                dish.comments.id(dish.comments[i]._id).deleteOne();
            }
            dish.save().then((dishC) => {
                response.json(dishC);
            });
        } else {
            err = new Error('Dish ' + request.params.dishId + 'not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => {
        next(err);
    }).catch((err) => {
        next(err);    
    });
});

dishRouter.route('/:dishId/comments/:commentId').options(cors.corsWithOptions, (req, res) => { res.sendStatus(200) })
.get(cors.cors, (request, response, next) => {
    Dishes.findById(request.params.dishId).populate('comments.author')
    .then((dish) => {
        if (dish !== null && dish.comments.id(request.params.commentId) !== null) {
            response.json(dish.comments.id(request.params.commentId));
        } else if (dish == null) {
            err = new Error('Dish ' + request.params.dishId + 'not found');
            err.status = 404;
            return next(err);
        } else {
            err = new Error('Comment ' + request.params.commentId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => {
        next(err);
    }).catch((err) => {
        next(err);
    });
}).post(cors.corsWithOptions, authenticate.verifyUser, (request, response, next) => {
    response.statusCode = 403;
    response.end('POST no tiene soporte para /dishes/ ' + request.params.dishId + "/comments/" + request.params.commentId);
}).put(cors.corsWithOptions, authenticate.verifyUser, (request, response, next) => {
    Dishes.findById(request.params.dishId).then((dish) => {
        if (dish !== null && dish.comments.id(request.params.commentId) !== null) {
            if (dish.comments.id(request.params.commentId).author._id.equals(request.user._id)) {
                if (request.body.rating) {
                    dish.comments.id(request.params.commentId).rating = request.body.rating;
                }
                if (request.body.comment) {
                    dish.comments.id(request.params.commentId).comment = request.body.comment;
                }
                dish.save().then((dishC) => {
                    Dishes.findById(dishC._id).populate('comments.author').then((fullDish) => {
                        response.json(fullDish);
                    }, (err) => next(err));
                }, (err) => next(err));
            } else {
                err = new Error('You are not allowed to modify this comment');
                err.status = 403;
                return next(err);
            }
        } else if (dish == null) {
            err = new Error('Dish ' + request.params.dishId + 'not found');
            err.status = 404;
            return next(err);
        } else {
            err = new Error('Comment ' + request.params.commentId + 'not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => {
        next(err);
    }).catch((err) => {
        next(err);
    });
}).delete(cors.corsWithOptions, authenticate.verifyUser, (request, response, next) => {
    Dishes.findById(request.params.dishId).then((dish) => {
        if (dish !== null && dish.comments.id(request.params.commentId) !== null) {
            if (dish.comments.id(request.params.commentId).author._id.equals(request.user._id)) {
                dish.comments.id(request.params.commentId).remove();
                dish.save().then((dishC) => {
                    Dishes.findById(dishC._id).populate('comments.author').then((fullDish) => {
                        response.json(fullDish);
                    }, err => next(err));
                }, err => next(err));
            } else {
                err = new Error('You are not allowed to delete this comment');
                err.status = 403;
                return next(err);
            }
        } else if (dish == null) {
            err = new Error('Dish ' + request.params.dishId + 'not found');
            err.status = 404;
            return next(err);
        } else {
            err = new Error('Comment ' + request.params.commentId + 'not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => {
        next(err);
    }).catch((err) => {
        next(err);    
    });
});

module.exports = dishRouter;
