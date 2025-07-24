const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const Article = require("./models/article");

const app = express();
const PORT = 3000;

mongoose
  .connect("mongodb://localhost:27017/storage")
  .then(() => console.log("Mongo connected"))
  .catch((err) => console.error("Mongo Error", err));

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(`${__dirname}/assets`));
app.use(express.urlencoded({ extended: false }));

app.get("/", async (req, res) => {
  try {
    const article = await Article.findOne();

    if (!article) {
      return res.send("Немає жодної статті в базі.");
    }

    if (article.comments) {
      article.comments = article.comments
        .filter((c) => c.visible)
        .map((c) => {
          c.dateStr = new Date(c.date).toLocaleString();
          return c;
        });
    }
    res.render("article", { article });
  } catch (err) {
    console.log(err);
    res.status(500).send("Error fetching the article");
  }
});

app.post("/comments", async (req, res) => {
  try {
    const article = await Article.findOne();

    if (!article) return res.status(404).send("The article not found");

    article.comments.push({
      author: req.body.author,
      text: req.body.text,
      date: new Date(),
    });

    await article.save();
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding a comment :(");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
