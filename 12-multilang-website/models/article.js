const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema({
  caption: {
    ua: {
      type: String,
      required: true,
    },
    fr: {
      type: String,
      required: true,
    },
  },
  text: {
    ua: {
      type: String,
      required: true,
    },
    fr: {
      type: String,
      required: true,
    },
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator: (v) => /^https?:\/\/.+\.(jpg|jpeg|png|webp|svg)/.test(v),
      message: (props) => `${props.value} is not a valid image URL`,
    },
  },
});

module.exports = mongoose.model("Article", articleSchema);
