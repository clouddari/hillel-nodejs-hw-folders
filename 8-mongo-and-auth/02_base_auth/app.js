const express = require("express");
const session = require("express-session");
const morgan = require("morgan");

const bodyParser = require("body-parser");
const app = express();

const MongoStore = require("connect-mongo");
const mongoUrl = "mongodb://localhost:27017/site";

const { MongoClient } = require("mongodb");
const bcrypt = require("bcrypt");

const client = new MongoClient(mongoUrl);
let usersCollection;
let tasksCollection;

async function dbConnect() {
  try {
    await client.connect();
    const db = client.db("site");
    usersCollection = db.collection("users");
    tasksCollection = db.collection("tasks");
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
}

// Налаштування шаблонізатора
app.set("view engine", "pug");
app.set("views", "./views");
// статика
app.use(express.static(`${__dirname}/assets`));

// Для роботи з кукі
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  session({
    store: MongoStore.create({
      mongoUrl,
      collectionName: "sessions",
      ttl: 60 * 60,
    }),

    secret: "your_secret_key_39393", // Ваш секрет для кукі
    resave: false, // не зберігати якщо не змінювалась
    saveUninitialized: false, // не зберігати в теку якщо не добавляли дані
    cookie: {
      maxAge: 3600000, // Час життя кукі у мс (1 час)
    },
  })
);

app.use(
  morgan("tiny", {
    skip: (req) => req.url.startsWith("/.well-known"),
  })
);

app.use((req, res, next) => {
  app.locals.username = req.session?.user?.email || null;
  app.locals.role = req.session?.user?.role || null;
  next();
});

app.get("/", (req, res) => {
  console.log(req.session.user);
  res.render("main");
});

app.get("/common", (req, res) => {
  res.render("common");
});

app.get("/login", (req, res) => {
  const { error, success } = req.query;
  res.render("login", { error, success });
});

app.post("/login", async (req, res) => {
  let { email, password } = req.body;

  email = email.trim().toLowerCase();

  try {
    const user = await usersCollection.findOne({ email });

    if (!user) {
      return res.redirect("/login?error=Login or password is incorrect");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.redirect("/login?error=Login or password is incorrect");
    }

    req.session.user = {
      email: user.email,
      role: user.role,
    };

    res.redirect("/dashboard");
  } catch (err) {
    console.error("Помилка при вході:", err);
    res.status(500).send("Помилка сервера при вході");
  }
});

// Захищена сторінка
app.get("/dashboard", async (req, res) => {
  if (!req.session.user) return res.redirect("/login");

  const role = req.session.user.role;
  const filter = { role };

  try {
    const tasks = await tasksCollection.find(filter).toArray();
    res.render("dashboard", {
      user: req.session.user,
      tasks,
    });
  } catch (err) {
    console.error("Помилка при отриманні задач:", err);
    res.status(500).send("Помилка сервера");
  }
});

// Вихід
app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", async (req, res) => {
  let { email, password, role } = req.body;
  email = email.trim().toLowerCase();
  role = role?.trim().toLowerCase() || "user";

  try {
    const existingUser = await usersCollection.findOne({ email });

    if (existingUser) {
      return res.render("register", {
        error: "User already exists",
        email,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      email,
      password: hashedPassword,
      role: role || "user",
    };

    await usersCollection.insertOne(newUser);
    res.redirect("/login?success=1");
  } catch (err) {
    console.error("Помилка при реєстрації:", err);
    res.status(500).send("Помилка сервера при реєстрації");
  }
});

dbConnect().then(() => {
  app.listen(3500, () => {
    console.log("Server http://localhost:3500");
  });
});
