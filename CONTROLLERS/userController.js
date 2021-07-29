const multer = require("multer");
const crypto = require("crypto");
const path = require("path");
const jwt = require("jsonwebtoken");
const fn = require("../GLOBAL_ERROR/catchAsync");
const User = require("../MODELS/userModel");
const ContactUs = require("../MODELS/contactUsModel");
const EMAIL = require("../EMAILS/userEmail");
const API = require("../GLOBAL_ERROR/err");
const getToken = async (id) => {
  return await new Promise((resolve, reject) => {
    try {
      resolve(
        jwt.sign({ id: id }, process.env.JWT_SECRET, {
          expiresIn: process.env.JWT_EXP,
        })
      );
    } catch (err) {
      reject(err);
    }
  });
};
sendCookie = (token, res) => {
  const cookie = res.cookie("cookie", token, {
    httpOnly: true,
    expires: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
  });
  return cookie;
};
module.exports.signUp = fn.wrapper(async (req, res, next) => {
  const { username, email, password, confirmPassword } = req.body;
  if (!username || !email || !password || !confirmPassword) {
    return next(new API("Enter information in the required Fields", 400));
  }
  const user = await User.create(req.body);
  const token = await getToken(user._id);
  sendCookie(token, res);
  const url = `${req.protocol}://${req.get("host")}/furnitures/login`;
  await new EMAIL(req.body, url).sendWelcome();
  return res.status(201).json({
    status: "success",
    message: "Your signed Up successFully",
    token,
  });
});
module.exports.login = fn.wrapper(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new API("You didnt enter the required fields", 400));
  }
  //  1 Check if user exist in the database
  const user = await User.findOne({ email });
  //2 Then check if passwords match with one in databse
  if (!user || !(await user.unHash(password, user.password))) {
    return next(new API("Incorrect Email or Password", 400));
  }
  const token = await getToken(user._id);
  sendCookie(token, res);
  return res.status(200).json({
    status: "success",
    message: "Your are SuccesFully Logged In.",
    token,
  });
});
module.exports.changePassword = fn.wrapper(async (req, res, next) => {
  const { oldPassword, password, confirmPassword } = req.body;
  if (!oldPassword || !password || !confirmPassword) {
    return next(new API("Cannot be empty", 400));
  }
  const user = await User.findOne({ _id: req.user._id });
  // CHECK IF PASSWORD THAT USER CURRENTLY HAS IS MATCHING  THE ONE IN DATABSE
  if (!(await user.unHash(oldPassword, user.password))) {
    return next(
      new API("Your Password does not match the one in our system", 400)
    );
  }
  user.oldPassword = oldPassword;
  user.password = password;
  user.confirmPassword = confirmPassword;
  await user.save({ validateBeforeSave: true });
  res.status(200).json({
    status: "success",
    message: "Password SuccessFully Changed",
  });
});
module.exports.isLoggedIn = async (req, res, next) => {
  let = user = "";
  try {
    // CHECK IF COOKIE EXIST
    if (!req.cookies.cookie) {
      return next();
    }
    const token = req.cookies.cookie;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // CHECK IF COOKIE HASNT EXPIRED

    // if (Date.now() > new Date(decoded.exp).getTime()) {
    //   return next();
    // }
    //CHECK IF USER EXIST
    user = await User.findById(decoded.id);
    if (!user) {
      return next();
    }
  } catch (err) {
    return next();
  }
  res.locals.user = user;
  next();
};
module.exports.logout = fn.wrapper(async (req, res, next) => {
  res.cookie("cookie", "bye");
  return res.status(200).json({
    status: "success",
    message: "Your successFully logout",
  });
});
module.exports.authenticate = fn.wrapper(async (req, res, next) => {
  // CHECK IF COOKIE EXIST
  if (!req.cookies.cookie) {
    return next(new API("Your are not allowed to access this route", 403));
  }
  const token = req.cookies.cookie;
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  //CHECK IF USER EXIST
  const user = await User.findById(decoded.id);
  if (!user) {
    return next(new API("The user who has this token no longer exists", 400));
  }
  // CHECK IF COOKIE HASNT EXPIRED
  if (Date.now() > new Date(Date.now() + decoded.exp).getTime()) {
    return next(new API("Your token has expired ", 400));
  }
  req.user = user;
  next();
});
module.exports.passUser = (req, res, next) => {
  res.locals.userAccount = req.user;
  next();
};
// MULTER
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, `${path.join(__dirname, "../PUBLIC/IMG/")}`);
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    const photo = `${Date.now()}-${req.user._id}.${ext}`;
    cb(null, photo);
  },
});

const filter = fn.wrapper(async (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    return cb(new API("The was an error uploading file"), false);
  }
});
const upload = multer({
  storage,
  fileFilter: filter,
});
module.exports.uploadPhoto = upload.single("image");
module.exports.updateMe = fn.wrapper(async (req, res, next) => {
  let body = { ...req.body };
  if (req.file) {
    body.image = req.file.filename;
  }
  await User.findByIdAndUpdate(req.user._id, body, {
    new: true,
    runValidators: true,
  });
  return res.status(200).json({
    status: "success",
    message: "Updated   SuccessFully",
    body,
  });
});
// RESET PASSWORD
module.exports.forgot = fn.wrapper(async (req, res, next) => {
  const { email } = req.body;
  // CHECK IF USER ENTERED REALLY EXIST IN THE DATA BASE
  const user = await User.findOne({ email });
  if (!user) {
    return next(new API("This Email doesn't exist", 400));
  }
  // IF USER EXIST SEND A TOKEN TO THE USER ON THE URL
  const token = user.createHashCrypto();
  const url = `${req.protocol}://${req.get(
    "host"
  )}/furnitures/User/Reset/resetToken?token=${token}`;
  await user.save({ validateBeforeSave: false });
  await new EMAIL(user, url).resetPassword();
  res.status(200).json({
    status: "success",
    message: "Check Your Email to Confirm Your Password",
  });
});
module.exports.reset = fn.wrapper(async (req, res, next) => {
  const { password, confirmPassword } = req.body;
  // CHECK IF THERES A TOKEN EXIST
  if (!req.query.token) {
    return next(new API("Something Went wrong", 400));
  }
  // CREATE HASH TO CHECK IF THE MATCH
  const match = crypto
    .createHash("sha256")
    .update(req.query.token)
    .digest("hex");
  // CHECK IF TOKEN IN DATABASE MATCH THE ONE CREATE
  const user = await User.findOne({ token: match });
  if (!user) {
    return next(new API("Something wrong with Your token", 400));
  }
  // CHECK IF TOKEN HASNT EXPIRED
  const ExpDate = new Date(user.tokenExp).getTime();
  if (Date.now() > ExpDate) {
    return next(new API("Your Token Expired", 400));
  }
  const url = `${req.protocol}://${req.get("host")}/login`;
  user.password = password;
  user.confirmPassword = confirmPassword;
  user.tokenExp = undefined;
  user.token = undefined;
  await user.save({ validateBeforeSave: true });
  await getToken(user._id);
  res.status(200).json({
    status: "success",
    message: "Your password success_fully resetted",
  });
});
// CONTACT US
module.exports.Contact = fn.wrapper(async (req, res, next) => {
  if (
    !req.body.name ||
    !req.body.category ||
    !req.body.message ||
    !req.body.country ||
    !req.body.message
  ) {
    return next(new API("Make sure Your fill All fields required", 400));
  }
  const userInfo = await ContactUs.create(req.body);
  res.status(200).json({
    status: "Success",
    message: "Thank Your for contacting Us",
  });
});
