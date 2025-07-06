const path = require("path");
const express = require("express");
const messageRoutes = require("./routes/messageRoutes");
const errorController = require("./controllers/errorController");
const morgan = require("morgan");

const app = express();

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use("/", messageRoutes);

app.use(morgan("tiny"));

app.use(errorController.pageNotFound);

module.exports = app;
