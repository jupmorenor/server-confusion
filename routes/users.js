const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const cors = require('./cors');
const User = require('../models/user');
const authenticate = require('../authenticate');

const userRouter = express.Router();
userRouter.use(bodyParser.json());

const sendAuthError = (next, message, code) => {
	var err = new Error(message);
	err.status = code;
	return next(err);
}

/* GET users listing. */
userRouter.route('/').all((request, response, next) => {
	response.statusCode = 200;
	response.setHeader('ContentType', 'Application/json');
	next();
}).options(cors.corsWithOptions, (req, res) => { res.sendStatus(200) })
.get(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (request, response, next) => {
	User.find({}).then((users) => {
		response.json(users);
	}, (err) => {
		next(err);
	}).catch((err) => {
		next(err);
	});
});

userRouter.post('/signup', cors.corsWithOptions, (request, response, next) => {
	User.register(new User({ username: request.body.username }), request.body.password, (err, user) => {
		if (err) {
			response.statusCode = 500;
			response.json({ err: err });
		} else {
			if (request.body.firstname) {
				user.firstname = request.body.firstname;
			}
			if (request.body.lastname) {
				user.lastname = request.body.lastname;
			}
			user.save((err, user) => {
				if (err) {
					response.statusCode = 500;
					response.json({ err: err });
				} else {
					passport.authenticate('local')(request, response, () => {
						response.statusCode = 201;
						response.json({ status: 'Registro exitoso', success: true });
					});
				}
			})
		}
	});
});

userRouter.post('/login', cors.corsWithOptions, passport.authenticate('local'), (request, response) => {
	const token = authenticate.getToken({ _id: request.user._id });

	response.statusCode = 201;
	response.json({ status: 'Ha sido autenticado', success: true, token: token });

});

userRouter.get('/logout', cors.corsWithOptions, (request, response, next) => {
	if (request.session) {
		request.session.destroy();
		response.clearCookie('session-id');
		response.redirect('/');
	} else {
		response.setHeader('WWW-Authenticate', 'Basic');
		return sendAuthError(next, 'No se encuentra autenticado', 401);
	}
});

userRouter.get('facebook/token', cors.cors, passport.authenticate('facebook-token'), (request, response) => {
	const token = authenticate.getToken({ _id: request.user._id });

	response.statusCode = 201;
	response.json({ status: 'Ha sido autenticado con facebook', success: true, token: token });
});

module.exports = userRouter;
