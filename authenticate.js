const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/user');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const FacebookTokenStrategy = require('passport-facebook-token');
const jwt = require('jsonwebtoken');

const config = require('./config');
const Users = require('./models/user');

exports.local = passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

exports.getToken = (user) => {
    return jwt.sign(user, config.secretKey, {expiresIn: 36000});
}

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;

exports.jwtPassport = passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
    User.findOne({_id: jwt_payload._id}, (err, user) => {
        if (err) {
            return done(err, false);
        } else if (user) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    });
}));

exports.verifyUser = passport.authenticate('jwt', {session: false});

exports.verifyAdmin = (request, response, next) => {
    if (request.user.admin) {
        next();
    } else {
        const err = new Error("You are not authorized to perform this operation!");
        err.status = 403;
        next(err);
    }
}

exports.facebookPassport = passport.use(new FacebookTokenStrategy({
    clientID: config.facebook.clientID,
    clientSecret: config.facebook.clienteSecret,
}, (accessToken, refreshToken, profile, done) => {
    Users.findOne({facebookId: profile.id}, (err, user) => {
        if (err) {
            return done(err, false);
        } else if (user !== null) {
            return done(null, user);
        } else {
            user = new User({username: profile.displayName});
            user.facebookId = profile.id;
            user.firstname = profile.name.givenName;
            user.lastname = profile.name.familyName;
            user.save((error, userS) => {
                if (error) {
                    return done(error, false);
                } else {
                    return done(null, userS);
                }
            });
        }
    });
}));
