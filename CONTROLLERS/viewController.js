const slug = require("slugify");
const Products = require("../MODELS/products");
const Booking = require("../MODELS/bookingModel");
const Review = require("../MODELS/reviewModel");
const fn = require("../GLOBAL_ERROR/catchAsync");
module.exports.home = (req, res, next) => {
  return res.status(200).render("base", {
    title: "Furnitures",
  });
};
module.exports.All = async (req, res, next) => {
  const products = await Products.find();
  return res.status(200).render("products", {
    title: "Furnitures",
    products,
  });
};
module.exports.login = (req, res, next) => {
  return res.status(200).render("login", {
    title: "Login",
  });
};
module.exports.signUp = (req, res, next) => {
  return res.status(200).render("sign", {
    title: "Furnitures | Sign Up",
  });
};
module.exports.account = (req, res, next) => {
  return res.status(200).render("account", {
    title: "Furnitures | Your Account",
  });
};
module.exports.single = fn.wrapper(async (req, res, next) => {
  const product = await Products.findById(req.params.single);
  return res.status(200).render("single", {
    title: "Furnitures | Single",
    product,
  });
});
module.exports.forgotPassword = (req, res, next) => {
  return res.status(200).render("forgot", {
    title: "Furnitures | Forgot Password",
  });
};
module.exports.resetPassword = (req, res, next) => {
  return res.status(200).render("reset", {
    title: "Furnitures|reset Password",
  });
};
module.exports.Booking = (req, res, next) => {
  return res.status(200).render("booking", {
    title: "Furnitures | Your Bookings",
    user: req.user,
  });
};
module.exports.Reviews = (req, res, next) => {
  return res.status(200).render("reviews", {
    title: "Furnitures | Your Review",
  });
};
module.exports.About = (req, res, next) => {
  return res.status(200).render("about", {
    title: "Furnitures | About",
  });
};
module.exports.Contact = (req, res, next) => {
  return res.status(200).render("contact", {
    title: "Furnitures | Contact",
  });
};
