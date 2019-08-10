const createError = require("http-errors");
const express = require("express");

const passport = require("passport");
require("./passportConfig");

const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const mongoose = require("mongoose");

const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const articleRouter = require("./routes/list");

const app = express();

let dev_db_url =
  "mongodb+srv://Afanasyev:453035asa@products-tutorial-f1brg.mongodb.net/test?retryWrites=true&w=majority";
//wFKrS9vW2ciPq.F
const mongoDB = process.env.MONGODB_URI || dev_db_url;
mongoose.connect(mongoDB, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
});
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: "my-secret",
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ url: dev_db_url }),
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
app.use("/api/test", require("./routes/tst.js"));
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
  res.render("error");
});

//

module.exports = app;
