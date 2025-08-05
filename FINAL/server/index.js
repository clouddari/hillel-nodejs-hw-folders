const express = require("express");
const cors = require("cors");
const connectDB = require("./db/db");
const config = require("./config/dev.json");
const itemRoutes = require("./routes/items");
const authRoutes = require("./routes/auth");

const app = express();
const PORT = config.port;

app.use(cors());
app.use(express.json());
app.use("/api/items", itemRoutes);
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Books & Movies API");
});

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Express app listening on port ${PORT}`);
  });
});
