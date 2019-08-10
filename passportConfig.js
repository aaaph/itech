const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("./models/user");

passport.serializeUser((user, done) => {
  console.log(`passport.serializeUser`);
  console.log(user);
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  console.log("passport.deserializeUser");
  console.log(id);
  User.findById(id, (err, user) => {
    if (err) console.log(err);
    done(err, user);
  });
});

passport.use(
  new LocalStrategy(
    { usernameField: "email", passwordField: "password" },
    (email, password, done) => {
      console.log("passport.use" + email + password);
      User.findOne({ email: email, password: password }, (err, user) => {
        if (err) return done(err);
        if (!user) return done(null, false);
        return done(null, user);
      });
    }
  )
);
