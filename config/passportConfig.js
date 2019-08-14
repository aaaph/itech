const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/user");
const crypto = require("crypto");

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    if (err) console.log(err);
    done(err, user);
  });
});

passport.use(
  new LocalStrategy(
    { usernameField: "email", passwordField: "password" },
    (email, password, done) => {
      User.findOne(
        {
          email: email,
          password: crypto
            .createHash("sha1")
            .update(password)
            .digest("base64")
        },
        (err, user) => {
          if (err) return done(err);
          if (!user) return done(null, false);
          return done(null, user);
        }
      );
    }
  )
);
