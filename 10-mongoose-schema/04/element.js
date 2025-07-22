const mongoose = require("mongoose");

const elementSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
    heightCm: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    powerW: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    bulbType: {
      type: String,
      required: true,
      enum: {
        values: ["E27", "E14", "G4", "G9"],
        message: "{VALUE} is not a supported bulb type",
      },
    },
    dimmable: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    optimisticConcurrency: true,
  }
);

const Element = mongoose.model("elements", elementSchema);

module.exports = Element;
