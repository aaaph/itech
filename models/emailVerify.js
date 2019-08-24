const mongoose = require("mongoose");
const nodemailer = require("nodemailer");

const EmailVerify = new mongoose.Schema({
  hash: {
    type: String,
    unique: true,
    required: true
  },
  userEmail: {
    type: String,
    unique: true,
    required: true,
    ref: "User"
  },
  userId: {
    type: mongoose.Types.ObjectId,
    required: true,
    unique: true,
    ref: "User"
  }
});
EmailVerify.statics = {
  async sendEmail(obj) {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_ADDR,
        pass: process.env.EMAIL_PASS
      },
      logger: false,
      debug: false
    });
    let message = {
      from: "itech-inform.com",
      to: obj.userEmail,

      subject: "Welcome to itech-inform✔",

      html: `<h1><b>Welcome to itech-inform</b></h1>
            <p>Congratulations! You are signed up for itech-inform.com</p>
            <p>To verify youy account click to this reference: ${
              process.env.DOMAIN_NAME
            }/api/users/verification/${obj.hash}        `
      // An array of attachments
    };

    let info = await transporter.sendMail(message);

    console.log(`message to ${obj.userEmail} send successfully!`);

    // only needed when using pooled connections
    transporter.close();
  }
};
module.exports = mongoose.model("EmailVerify", EmailVerify);
