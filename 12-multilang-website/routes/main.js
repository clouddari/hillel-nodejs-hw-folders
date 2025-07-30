const express = require("express");
const router = express.Router();
const Article = require("../models/article");

router.get("/", async (req, res) => {
  try {
    const article = await Article.findOne();
    if (!article) {
      return res.status(500).send("Статтю не знайдено");
    }

    const lang = req.getLocale();
    req.setLocale(lang);
    res.render("main", { article, lang, path: req.path });
  } catch (err) {
    console.error("Error fetching article", err);
    res.status(500).send("Server error");
  }
});

router.get("/page", async (req, res) => {
  try {
    const articles = await Article.find().skip(1).limit(1);
    const lang = req.getLocale();
    req.setLocale(lang);

    res.render("page", {
      article: articles[0],
      lang,
      path: req.baseUrl + req.path,
    });
  } catch (err) {
    console.error("Error fetching second article", err);
    res.status(500).send("Server error");
  }
});

module.exports = router;
