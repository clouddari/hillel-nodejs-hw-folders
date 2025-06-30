const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const port = 3000;

app.listen(port, () => `express is working on: http://localhost:${port}`);

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("main");
});

app.get("/form", (req, res) => {
  res.render("form");
});

app.post("/form", (req, res) => {
  const { username, message } = req.body;
  const newEntry = { username, message, time: new Date().toLocaleString() };

  let data = [];
  if (fs.existsSync("message.json")) {
    const raw = fs.readFileSync("message.json");
    data = JSON.parse(raw);
  }

  data.push(newEntry);

  fs.writeFileSync("message.json", JSON.stringify(data, null, 2));

  res.redirect("/guests");
});

app.get("/guests", (req, res) => {
  let data = [];

  if (fs.existsSync("message.json")) {
    const raw = fs.readFileSync("message.json");
    data = JSON.parse(raw);
  }

  res.render("guests", { guests: data });
});
