const mongoose = require("mongoose");

const elementSchema = new mongoose.Schema(
  {
    brand: {
      type: String,
      minlength: 2,
      maxlength: 20,
      required: true,
    },
    model: {
      type: String,
      required: true,
    },
    year: {
      type: Number,
      min: 1980,
      max: 2026,
      required: true,
    },
    color: {
      type: String,
      default: "unspecified",
    },
    price: {
      type: Number,
      min: 0,
    },
    vin: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return /^[A-HJ-NPR-Z0-9]{17}$/.test(v);
        },
        message: (props) => `${props.value} is not a valid VIN format!`,
      },
    },
  },
  {
    timestamps: true,
    optimisticConcurrency: true,
  }
);

const Element = mongoose.model("elements", elementSchema);

module.exports = Element;
