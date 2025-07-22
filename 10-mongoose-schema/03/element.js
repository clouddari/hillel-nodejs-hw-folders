const mongoose = require("mongoose");

const elementSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    birthDate: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return /^\d{4}-\d{2}-\d{2}$/.test(v);
        },
        message: (props) =>
          `${props.value} is not a valid birth date (expected format: Рядок у форматі: "РРРР-MM-DD")`,
      },
    },
    email: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: (props) => `${props.value} is not a valid email!`,
      },
    },

    phone: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return /^\+\d{12}$/.test(v);
        },
        message: (props) =>
          `${props.value} is not a valid phone number! It must start with + and contain 12 digits.`,
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
