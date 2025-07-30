const mongoose = require("mongoose");
const config = require("../config/dev.json");

async function connectDB() {
  try {
    await mongoose.connect(config.mongoUrl);
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
}

module.exports = connectDB;
