const mongoose = require("mongoose");
const fs = require("fs");
const Article = require("./models/article");

mongoose
  .connect("mongodb://127.0.0.1:27017/storage")
  .then(async () => {
    await Article.deleteMany();
    const data = JSON.parse(fs.readFileSync("article.json", "utf-8"));
    await Article.insertMany(data);
    console.log("Базу оновлено");
    mongoose.connection.close();
  })
  .catch((err) => {
    console.error("Помилка при оновленні:", err);
    mongoose.connection.close();
  });
