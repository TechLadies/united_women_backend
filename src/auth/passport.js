const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const { User } = require("../models");

passport.use(
  new LocalStrategy(async (username, password, done) => {
    let user = await User.findOne({ where: { username: username } }).catch(
      err => {
        //error handling
        console.error(err);
        return done(err);
      }
    );

    //if user doesnt exist
    if (!user) {
      return done(null, false, { message: "User not found." });
    }

    //authentication
    /* bcrypt.compare(password, user.passwordHash, (err, isValid) => {
      //error handling
      if (err) {
        console.error(err);
        return done(err);
      }

      //if password is invalid
      if (!isValid) {
        return done(null, false, { message: "Incorrect password." });
      } else {
        return done(null, user);
      }
    }); */
    user.validatePassword(password, user, done);
  })
);

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

module.exports = passport;
