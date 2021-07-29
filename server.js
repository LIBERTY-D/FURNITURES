const express = require("express");
const app = express();
const mongoose = require("mongoose");
const PORT = process.env.PORT | 3000;
const DB = async (url) => {
  try {
    const connect = await mongoose.connect(url, {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // autoIndex: true, //
      useFindAndModify: false,
    });
    console.log("DATABASE CONNECTED...");
  } catch (err) {
    console.log("The WAS AN ERROR", err);
  }
};
module.exports = DB;
