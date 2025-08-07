const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();
const connectDB = require("./db/db");
const config = require("./config/dev.json");
const itemRoutes = require("./routes/items");
const authRoutes = require("./routes/auth");

const app = express();
const PORT = config.port;

app.use(cors({ origin: "http://localhost:5173", credentials: true }));

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/items", itemRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", require("./routes/user"));
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));

app.get("/", (req, res) => {
  res.send("Books & Movies API");
});

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Express app listening on port ${PORT}`);
  });
});
