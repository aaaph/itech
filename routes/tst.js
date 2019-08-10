const router = require("express").Router();
const passport = require("passport");
const crypto = require("crypto");
const User = require("../models/user");

router.post(
  "/login",
  (req, res, next) => {
    if (req.isAuthenticated())
      res.send({ status: "authenticated", session: req.session });
    else {
      next();
    }
  },
  (req, res, next) => {
    console.log(req.body);
    passport.authenticate("local", (err, user) => {
      console.log(`passport.authenticate ${user}`);
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.send({ status: "invalid email or password" });
      }
      req.logIn(user, err => {
        if (err) {
          return next(err);
        }
        return res.send({ status: "authenticated", session: req.session });
      });
    })(req, res, next);
  }
);

router.get("/", (req, res, next) => {
  if (req.isAuthenticated()) {
    User.findById(req.session.passport.user)
      .then(
        user => {
          console.log(user);
          return { status: "authenticated", user: user };
        },
        err => {
          return { status: "denied", result: err };
        }
      )
      .then(result => res.json(result));
  } else {
    res.json({ status: "not authenticated", session: req.session });
  }
});

router.post("/create", (req, res, next) => {
  //need check
  User.findOne({ email: req.body.email })
    .then(result => {
      if (result) {
        res.json({ status: "exist", user: result });
      } else {
        const user = {
          username: req.body.username,
          email: req.body.email,
          password: hash(req.body.password)
        };
        return User(user).save();
      }
    })
    .then(
      user => res.json({ status: "success", user: user }),
      err => res.json({ status: "denied", err: err })
    );
  //User.findOne(user).then(result => res.json(result));
});

router.get("/logout", (req, res, next) => {
  req.logout();
  if (!req.isAuthenticated()) {
    res.json({ status: "success" });
  }
});

const hash = text => {
  return crypto
    .createHash("sha1")
    .update(text)
    .digest("base64");
};
module.exports = router;
