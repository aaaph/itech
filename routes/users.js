const router = require("express").Router();
const passport = require("passport");
const crypto = require("crypto");
const User = require("../models/user");
const EmailVerify = require("../models/emailVerify");

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
    passport.authenticate("local", (err, user) => {
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
        return res.send({
          status: "success",
          user: user,
          session: req.session
        });
      });
    })(req, res, next);
  }
);
router.get("/:id", (req, res, next) => {
  const ObjetId = require("mongoose").Types.ObjectId;
  console.log(typeof req.params.id);
  User.findById(ObjetId(req.params.id)).then(user => res.json(user));
});
router.get("/", (req, res, next) => {
  if (req.isAuthenticated()) {
    User.findById(req.session.passport.user)
      .then(
        user => {
          if (user.active) return { status: "authenticated", user: user };
          return { status: "not verified", user: user };
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

router.get("/verification/:hash", (req, res, next) => {
  EmailVerify.findOneAndDelete({ hash: req.params.hash })
    .then(emailVerify =>
      User.findByIdAndUpdate(
        emailVerify.userId,
        { active: true },
        { new: true }
      )
    )
    .then(user => res.json({ status: "success", user: user }))
    .catch(err => next(err));
});

router.post("/create", (req, res, next) => {
  //need check(forgot why)
  User.findOne({ email: req.body.email })
    .then(user => (user ? user : User.findOne({ username: req.body.username })))
    .then(user =>
      user
        ? { status: "exist", user: user }
        : User({
            username: req.body.username,
            email: req.body.email,
            password: crypto
              .createHash("sha1")
              .update(req.body.password)
              .digest("base64")
          })
            .save()
            .then(user => {
              EmailVerify({
                hash: crypto
                  .createHash("sha256")
                  .update(user.username)
                  .digest("hex"),
                userEmail: user.email,
                userId: user._id
              })
                .save()
                .then(emailVerify => EmailVerify.sendEmail(emailVerify));
              res.redirect(307, "/api/users/login");
            })
            .catch(err => {
              return { status: "denied", err: err };
            })
    )
    .then(result => res.json(result));
});

router.put(
  "/update",
  (req, res, next) => {
    if (req.isAuthenticated()) next();
    else {
      res.json({ status: "not authenticated" });
    }
  },
  (req, res, next) => {
    User.findByIdAndUpdate(
      req.session.passport.user,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: crypto
            .createHash("sha1")
            .update(req.body.password)
            .digest("base64")
        }
      },
      { new: true }
    )
      .then(user => res.json({ status: "success", user: user }))
      .catch(err => {
        next(err);
      }); //res.json({ status: "denied", err: err }));
  }
);
router.delete(
  "/delete",
  (req, res, next) => {
    if (req.isAuthenticated()) next();
    else {
      res.json({ status: "not authenticated" });
    }
  },
  (req, res, next) => {
    User.findByIdAndDelete(req.session.passport.user)
      .then(result => res.json({ status: "success", result: result }))
      .catch(err => res.json({ status: "denied", err: err }));
  }
);
router.post("/logout", (req, res, next) => {
  req.logout();
  if (!req.isAuthenticated()) {
    res.json({ status: "success" });
  }
});

module.exports = router;
