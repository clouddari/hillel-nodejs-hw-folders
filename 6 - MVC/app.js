const path = require("path");
const express = require("express");
const messageRoutes = require("./routes/messageRoutes");
const morgan = require("morgan");

const app = express();

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use("/", messageRoutes);

app.use(morgan("tiny"));
app.use((req, res, next) => {
  res.status(404).render("404");
});

module.exports = app;
