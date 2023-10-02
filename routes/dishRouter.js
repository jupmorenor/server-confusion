const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Dishes = require('../models/dishes');
const authenticate = require('../authenticate');

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
}).post(authenticate.verifyUser, (request, response, next) => {
    Dishes.create(request.body).then((dish) => {
        console.log('Dish creado', dish)
        response.statusCode = 201;
        response.json(dish);
    }, (err) => {
        next(err);
    }).catch((err) => {
        next(err);    
    });
}).put(authenticate.verifyUser, (request, response, next) => {
    response.statusCode = 403;
    response.end('PUT no tiene soporte para /dishes');
}).delete(authenticate.verifyUser, (request, response, next) => {
    Dishes.deleteMany({}).then((resp) => {
        response.json(resp);
    }, (err) => {
        next(err);
    }).catch((err) => {
        next(err);    
    });
});

dishRouter.route('/:dishId').get((request, response, next) => {
    Dishes.findById(request.params.dishId).then((dish) => {
        response.json(dish);
    }, (err) => {
        next(err);
    }).catch((err) => {
        next(err);
    });
}).post(authenticate.verifyUser, (request, response, next) => {
    response.statusCode = 403;
    response.end('POST no tiene soporte para /dishes/ ' + request.params.dishId);
}).put(authenticate.verifyUser, (request, response, next) => {
    Dishes.findByIdAndUpdate(request.params.dishId, {
        $set: request.body,
    }, {new: true}).then((dish) => {
        response.json(dish);
    }, (err) => {
        next(err);
    }).catch((err) => {
        next(err);
    });
}).delete(authenticate.verifyUser, (request, response, next) => {
    Dishes.findByIdAndRemove(request.params.dishId).then((resp) => {
        response.json(resp);
    }, (err) => {
        next(err);
    }).catch((err) => {
        next(err);    
    });
});

dishRouter.route('/:dishId/comments').get((request, response, next) => {
    Dishes.findById(request.params.dishId).then((dish) => {
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
}).post(authenticate.verifyUser, (request, response, next) => {
    Dishes.findById(request.params.dishId).then((dish) => {
        if (dish !== null) {
            dish.comments.push(request.body);
            dish.save().then((dishC) => {
                response.statusCode = 201;
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
}).put(authenticate.verifyUser, (request, response, next) => {
    response.statusCode = 403;
    response.end('PUT no tiene soporte para /dishes/' + request.params.dishId + '/comments');
}).delete(authenticate.verifyUser, (request, response, next) => {
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

dishRouter.route('/:dishId/comments/:commentId').get((request, response, next) => {
    Dishes.findById(request.params.dishId).then((dish) => {
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
}).post(authenticate.verifyUser, (request, response, next) => {
    response.statusCode = 403;
    response.end('POST no tiene soporte para /dishes/ ' + request.params.dishId + "/comments/" + request.params.commentId);
}).put(authenticate.verifyUser, (request, response, next) => {
    Dishes.findById(request.params.dishId).then((dish) => {
        if (dish !== null && dish.comments.id(request.params.commentId) !== null) {
            if (request.body.rating) {
                dish.comments.id(request.params.commentId).rating = request.body.rating;
            }
            if (request.body.comment) {
                dish.comments.id(request.params.commentId).comment = request.body.comment;
            }
            dish.save().then((dishC) => {
                response.json(dishC);
            });
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
}).delete(authenticate.verifyUser, (request, response, next) => {
    Dishes.findById(request.params.dishId).then((dish) => {
        if (dish !== null && dish.comments.id(request.params.commentId) !== null) {
            dish.comments.id(request.params.commentId).deleteOne();
            dish.save().then((dishC) => {
                response.json(dishC);
            });
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
