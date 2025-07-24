const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  author: String,
  text: {
    type: String,
    required: true,
  },
  visible: {
    type: Boolean,
    default: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const contentSchema = new mongoose.Schema({
  body: {
    type: String,
    required: true,
  },
  summary: String,
});

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
    unique: true,
  },
  content: contentSchema,
  comments: [commentSchema],
});

module.exports = mongoose.model("Article", articleSchema);
