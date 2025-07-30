const mongoose = require("mongoose");
const connectDB = require("../db/db");
const Article = require("../models/article");
const data = require("../data/articles.json");

async function seedArticles() {
  try {
    await connectDB();

    const count = await Article.countDocuments();
    console.log("Статей до видалення:", count);

    await Article.deleteMany();
    const inserted = await Article.insertMany(data);

    console.log(`Вставлено статей: ${inserted.length}`);
    inserted.forEach((a, i) => {
      console.log(`#${i + 1}: ${a.caption.ua}`);
    });
  } catch (err) {
    console.error("Помилка вставки:", err);
  } finally {
    mongoose.disconnect();
  }
}

seedArticles();
