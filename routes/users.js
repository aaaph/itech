var express = require("express");
var router = express.Router();
var api = require("../api");

router.post("/login", (req, res, next) => {
  if (req.session.user) return res.redirect("/");
  api
    .checkUser(req.body)
    .then(user => {
      console.log("user" + user + `\n${user ? true : false}`);
      if (user) {
        console.log(req.session);
        req.session.user = { id: user._id, name: user.username };
        console.log(req.session);
        res.redirect("/");
      }
    })
    .catch(data => res.status(500).send({ status: data }));
});

router.post("/", (req, res, next) => {
  console.log(req.body);
  api.createUser(req.body).then(
    () => res.status(200).send({ status: "created" }),
    err => {
      if (err.code == 11000)
        res.status(500).send({ status: "login or emeil already created!" });
    }
  );
});

router.post("/logout", (req, res, next) => {
  console.log(req.session);
  if (req.session.user) {
    delete req.session.user;
    res.redirect("/");
  }
});
router.get("/", function(req, res, next) {
  if (req.session.user) {
    var data = {
      title: "Express",
      user: req.session.user
    };
    res.render("index", data);
  } else {
    var data = {
      title: "Express"
    };
    res.render("index", data);
  }
});
module.exports = router;
