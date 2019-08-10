var express = require("express");
var router = express.Router();

const auth = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.send({ status: "not authenticated" });
  }
};

/* GET home page. */
router.get("/", function(req, res, next) {
  res.redirect("/api/list");
});
router.get("/api/admin", auth, (req, res, next) => {
  res.send({ status: "authenticated" });
});
module.exports = router;
