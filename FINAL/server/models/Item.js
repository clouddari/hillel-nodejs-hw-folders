const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  author: String,
  authorPic: String,
  rating: Number,
  text: String,
  time: { type: Date, default: Date.now },
  approved: { type: Boolean, default: false }, 
});


const itemSchema = new mongoose.Schema({
  type: { type: String, enum: ["book", "movie"], required: true },
  name: { type: String, required: true },
  year: Number,
  description: String,
  id: String, 
  image: String,
  reviews: [reviewSchema],
});

module.exports = mongoose.model("Item", itemSchema);
