const mongoose = require("mongoose");

const elementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      minlength: 10,
      maxlength: 300,
    },
    content: {
      type: String,
      required: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    published: {
      type: Boolean,
      defaul: false,
    },
  },
  {
    timestamps: true,
    optimisticConcurrency: true,
  }
);

const Element = mongoose.model("elements", elementSchema);

module.exports = Element;
