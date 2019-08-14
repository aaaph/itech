const createError = require("http-errors");
const express = require("express");

const passport = require("passport");
require("./config/passportConfig");

const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
require("./config/dbConfig");

const logger = require("./config/loggerConfig");

const cookieParser = require("cookie-parser");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const articleRouter = require("./routes/list");

const app = express();

app.use(logger.consoleLogger, logger.fileLogger);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(
  session({
    secret: "my-secret",
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ url: process.env.DB_URL }),
    cookie: {
      path: "/",
      httpOnly: true,
      maxAge: 60 * 60 * 1000
    }
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/", indexRouter);
app.use("/api/list", articleRouter);
app.use("/api/users", usersRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({ message: err.message, error: err });
});

//
module.exports = app;
