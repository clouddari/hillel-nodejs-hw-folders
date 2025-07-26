const express = require("express");
const mongoose = require("mongoose");

const app = express();
const PORT = 3000;


// mongoose
//   .connect("mongodb://localhost:27017/your-db-name")
//   .then(() => console.log("MongoDB connected"))
//   .catch((err) => console.error("MongoDB error", err));

app.get("/", (req, res) => {
  res.send("Hello express!");
});

app.listen(PORT, () => {
  console.log(`Express app listening on port ${PORT}`);
});
