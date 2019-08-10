const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let articleSchema = new Schema({
  title: { type: String, require: true, max: 50 },
  createDate: { type: Date, required: true },
  body: { type: String, required: true },
  theme: { type: String, required: true, max: 25 }
});

module.exports = mongoose.model("article", articleSchema);
