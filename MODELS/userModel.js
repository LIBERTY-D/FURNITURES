const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const mongoose = require("mongoose");
const validator = require("validator");

const user_schema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Username Required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: "Please Provide a valid Email address",
    },
  },
  password: {
    type: String,
    required: [true, "Password  is required"],
  },
  image: {
    type: String,
    default: "default.png",
  },
  confirmPassword: {
    type: String,
    required: [true, " Confirm Password  is required"],
    validate: {
      validator: function (val) {
        return val === this.password;
      },
      message: "Passwords do not match",
    },
  },
  createdAccountAt: {
    type: Date,
    default: Date.now(),
  },
  resetDate: {
    type: Date,
  },
  token: {
    type: String,
  },
  tokenExp: {
    type: Date,
  },
  oldPassword: {
    type: String,
  },
});
// MODIFIED WHEN CREATED OT WHEN SAVED

user_schema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;
  this.oldPassword = undefined;
  next();
});
user_schema.methods.unHash = async function (userPwd, dbPwd) {
  const pwd = await bcrypt.compare(userPwd, dbPwd);
  return pwd;
};
user_schema.methods.createHashCrypto = function () {
  const createToken = crypto.randomBytes(32).toString("hex");
  this.token = crypto.createHash("sha256").update(createToken).digest("hex");
  this.resetDate = Date.now();
  this.tokenExp = Date.now() + 10 * 60 * 1000;
  return createToken;
};
const User = mongoose.model("User", user_schema);
module.exports = User;
