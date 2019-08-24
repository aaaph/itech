const mongoose = require("mongoose");

const User = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  active: {
    type: Boolean,
    required: true,
    default: false
  }
});

module.exports = mongoose.model("User", User);
