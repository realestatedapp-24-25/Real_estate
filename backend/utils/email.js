const nodemailer = require("nodemailer");
const pug = require("pug");
const { convert } = require("html-to-text");
require("dotenv").config();
module.exports = class Email {
  constructor(email, url) {
    this.to = email;
    this.url = url;
    this.from = `Real Estate Platform <${process.env.EMAIL_FROM}>`;
  }

  newTransport() {
    if (process.env.NODE_ENV === "production") {
      return;
    }

    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }
  async send(template, subject, data = {}) {
    const html = pug.renderFile(`${__dirname}/../email/${template}.pug`, {
      url: this.url,
      subject,
      ...data,
    });

    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: convert(html),
    };

    await this.newTransport().sendMail(mailOptions);
  }

  async sendPropertyConfirmation(property) {
    await this.send("property", "Your Property Listing is Live!", {
      property,
    });
  }
};
