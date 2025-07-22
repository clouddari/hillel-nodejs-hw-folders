const mongoose = require("mongoose");

const elementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return /\s/.test(v);
        },
        message: (props) => `${props.value} must contain at least one space`,
      },
    },
    year: {
      type: Number,
      required: true,
      min: 1700,
      max: 2026,
    },
  },
  {
    timestamps: true,
    optimisticConcurrency: true,
  }
);

const Element = mongoose.model("elements", elementSchema);

module.exports = Element;
