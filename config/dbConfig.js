const mongoose = require("mongoose");
console.log(typeof process.env.DB_URL);
const mongoDB = process.env.MONGODB_URI || process.env.DB_URL.toString();
mongoose.connect(mongoDB, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
});
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
