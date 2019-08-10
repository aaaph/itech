const mongoose = require("mongoose");
const crypto = require("crypto");
/*let dev_db_url =
  "mongodb+srv://Afanasyev:453035asa@products-tutorial-f1brg.mongodb.net/test?retryWrites=true&w=majority";
const db = mongoose.connect(dev_db_url, { useNewUrlParser: true });*/
const User = require("./models/user");

exports.createUser = userData => {
  const user = {
    username: userData.username,
    emeil: userData.emeil,
    password: userData.password
  };
  return new User(user).save();
};

exports.getUser = id => {
  return User.findOne(id);
};

exports.checkUser = userData => {
  return User.findOne({
    emeil: userData.emeil
  })
    .then(doc => {
      console.log(doc);
      console.log(userData);
      if (doc.password == userData.password) {
        console.log("user password is ok");
        return Promise.resolve(doc);
      }
    })
    .catch(data => {
      console.log(data);
      return Promise.reject("invalid username or emeil");
    });
};

const hash = text => {
  return crypto
    .createHash("sha1")
    .update(text)
    .digest("base64");
};
