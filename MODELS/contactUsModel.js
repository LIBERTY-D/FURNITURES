const mongoose = require("mongoose");
const validator = require("validator");

const contact_schema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  email: {
    type: String,
    required: [true, "Name is required"],
    validate: validator.isEmail,
  },
  category: {
    type: String,
  },
  country: {
    type: String,
    required: [
      true,
      "We need to know your country to help you with our nearest stores",
    ],
  },
  message: {
    type: String,
    required: [true, "We need Your message in order to help You"],
  },
});
const ContactUs = mongoose.model("ContactUs", contact_schema);
module.exports = ContactUs;
