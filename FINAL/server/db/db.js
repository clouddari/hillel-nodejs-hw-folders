const mongoose = require("mongoose");
require("dotenv").config({ path: "./.env" });

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("MongoDB connected");
  } catch (err) {
    console.error(" Mongo DB connection error", err);
    process.exit(1);
  }
}

module.exports = connectDB;
