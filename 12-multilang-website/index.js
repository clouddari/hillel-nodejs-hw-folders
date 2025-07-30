const connectDB = require("./db/db");

connectDB().then(() => {
  const express = require("express");
  const path = require("path");
  const i18n = require("i18n");
  const config = require("./config/dev.json");
  const app = express();
  const PORT = config.port;

  app.set("view engine", "pug");
  app.set("views", path.join(__dirname, "views"));
  app.use(express.static(`${__dirname}/public`));
  app.use(express.urlencoded({ extended: false }));

  i18n.configure({
    locales: ["fr", "ua"],
    directory: path.join(__dirname, "locales"),
    defaultLocale: config.defaultLocale,
    cookie: "lang",
    autoReload: true,
    updateFiles: false,
    syncFiles: false,
  });

  app.use(i18n.init);

  app.use("/:lang", (req, res, next) => {
    const lang = req.params.lang;

    if (i18n.getLocales().includes(lang)) {
      req.setLocale(lang);
      res.locals.lang = lang;
    } else {
      req.setLocale(config.defaultLocale);
      res.locals.lang = config.defaultLocale;
    }

    res.locals.path = req.baseUrl + req.path;
    next();
  });

  app.get("/", (req, res) => res.redirect(`/${config.defaultLocale}`));

  const mainRouter = require("./routes/main");
  app.use("/:lang", mainRouter);

  app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });
});
