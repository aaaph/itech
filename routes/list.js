const express = require("express");
const router = express.Router();
const Article = require("../models/article");

router.post("/create", (req, res, next) => {
  let article = new Article({
    title: req.body.title,
    createDate: new Date(),
    body: req.body.body,
    theme: req.body.theme
  });
  article.save(err => {
    if (err) return next(err);
    res.json({
      status: "created",
      body: article,
      date: article.createDate.toLocaleString()
    });
  });
});

router.get("/", (req, res, next) => {
  Article.find({})
    .then(articles => {
      let arr = new Array();
      for (item in articles) {
        let local = {
          title: articles[item].title,
          createDate: articles[item].createDate.toLocaleString(),
          body: articles[item].body,
          theme: articles[item].theme
        };
        arr.push(local);
      }
      return arr;
    })
    .then(a => {
      return a;
    })
    .then(articles => res.send(articles));
});
router.get("/:id", (req, res, next) => {
  Article.findById(req.params.id)
    .then(
      article => {
        if (!article) return { status: "not found" };
        let local = {
          title: article.title,
          createDate: article.createDate.toLocaleString(),
          body: article.body,
          theme: article.theme
        };
        return local;
      },
      err => {
        return { status: "denied", result: err };
      }
    )
    .then(result => res.json(result));
});

router.put("/:id/update", (req, res, next) => {
  const body = req.body;
  body.createDate = new Date();

  Article.findByIdAndUpdate(req.params.id, { $set: body })
    .then(article => {
      if (
        article.body == body.body &&
        article.theme == body.theme &&
        article.title == body.title
      ) {
        res.json({ status: "same" });
      } else {
        return article;
      }
    })
    .then(
      article => {
        return { status: "updated", body: article };
      },
      () => {
        return { status: "not found" };
      }
    )
    .then(result => res.json(result));
});

router.delete("/:id/delete", (req, res, next) => {
  Article.findByIdAndDelete(req.params.id)
    .then(
      result => {
        if (!result) {
          return { status: "not found", body: req.params.id };
        }
        return { status: "success", id: req.params.id, result: result };
      },
      result => {
        return { status: "denied", result: result };
      }
    )
    .then(result => res.json(result));
});

module.exports = router;
