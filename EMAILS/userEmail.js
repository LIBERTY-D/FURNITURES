require("dotenv").config();
const { htmlToText } = require("html-to-text");
const pug = require("pug");
const nodeMailer = require("nodemailer");
const path = require("path");
class Email {
  constructor(user, url) {
    this.from = process.env.MY_EMAIL;
    this.to = user.email;
    this.username = user.username;
    this.url = url;
  }
  createTransport() {
    return nodeMailer.createTransport({
      service: "SendGrid",
      auth: {
        user: process.env.SENDGRID_USERNAME,
        pass: process.env.SENDGRID_PASSWORD,
      },
    });
  }
  async send(template, subject) {
    const html = pug.renderFile(
      path.join(__dirname, `../VIEWS/${template}.pug`),
      {
        username: this.username,
        url: this.url,
        subject,
      }
    );
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
    };
    await this.createTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    try {
      await this.send("email-template", "WELCOME TO Furnitures");
    } catch (err) {
      return err;
    }
  }
  async resetPassword() {
    try {
      await this.send("reset-template", "Reset Your Password");
    } catch (err) {
      return err;
    }
  }
}

module.exports = Email;
