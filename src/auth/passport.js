const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const { User } = require("../models");

passport.use(
  new LocalStrategy(async (username, password, done) => {
    let user = await User.findOne({ where: { username: username } });

    //if user doesnt exist
    if (!user) {
      return done(null, false, { message: "User not found." });
    }

    //authentication
    user.validatePassword(password, user, done);
  })
);

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(async function(id, done) {
  const user = await User.findByPk(id);
  if (user) {
    return done(null, user);
  } else {
    return done({ error: "User not found." }, null);
  }
});

module.exports = passport;
