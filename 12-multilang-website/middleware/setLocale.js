const i18n = require("i18n");
const config = require("../config/dev.json");

function setLocale(req, res, next) {
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
}

module.exports = setLocale;
