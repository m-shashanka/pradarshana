const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const mongoose = require("mongoose");
const User = mongoose.model("users");
const keys = require("../config/keys");
const ROLES = require("../constants/roles");

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;

const authorize = (role) => {
  return new JwtStrategy(opts, (jwtPayload, done) => {
    User.findById(jwtPayload.id)
      .then((user) => {
        if (user) {
          if (role !== ROLES.ALL_USERS) {
            if (user.roles.includes(role) || user.roles.includes(ROLES.ADMIN)) {
              const newUser = { ...user.toObject() };
              delete newUser.password;
              return done(null, newUser);
            }
            return done();
          } else {
            return done(null, user);
          }
        }
        return done(null, false);
      })
      .catch((err) => {
        console.log(err);
        done("Something went wrong!!");
      });
  });
};

module.exports = (passport) => {
  // Use this rule to authenticate the routes which are only for students
  passport.use(ROLES.STUDENT, authorize(ROLES.STUDENT));

  // Use this rule to authenticate the routes which are only for professors
  passport.use(ROLES.PROFESSOR, authorize(ROLES.PROFESSOR));

  // Use this rule to authenticate the routes which are for both students and professors
  passport.use(ROLES.ALL_USERS, authorize(ROLES.ALL_USERS));

  // Use this ti authorize only admin
  passport.use(ROLES.ADMIN, authorize(ROLES.ADMIN));
};
