const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const User = require('../models/user');
const config = require('../config/database');

module.exports = function (passport) {
    var opts = {}
    opts.jwtFromRequest = ExtractJwt.fromHeader('authorization');
    opts.secretOrKey = config.secret;
    passport.use(new JwtStrategy(opts, function (jwt_payload, done) {
            User.findById(jwt_payload._id, function (err, user) {
                // console.log(user,">?>?>")
                if (err) {
                    return done(err, false);
                }
                if (user) {
                    return done(null, user);
                } else {
                    return done(null, false);
                }
            });
        
    }));
}
