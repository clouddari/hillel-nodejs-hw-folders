const express = require("express");
const router = express.Router();
const Page = require("../models/page");

router.get("/", async (req, res) => {
  try {
    const page = await Page.findOne();
    if (!page) {
      return res.status(500).send("Статтю не знайдено");
    }

    const lang = req.getLocale();
    req.setLocale(lang);
    res.render("main", { page, lang, path: req.path });
  } catch (err) {
    console.error("Error fetching page", err);
    res.status(500).send("Server error");
  }
});

router.get("/page", async (req, res) => {
  try {
    const pages = await Page.find().skip(1).limit(1);
    const lang = req.getLocale();
    req.setLocale(lang);

    res.render("page", {
      page: pages[0],
      lang,
      path: req.baseUrl + req.path,
    });
  } catch (err) {
    console.error("Error fetching second page", err);
    res.status(500).send("Server error");
  }
});

module.exports = router;
