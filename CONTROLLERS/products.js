const Products = require("../MODELS/products");
const fn = require("../GLOBAL_ERROR/catchAsync");
module.exports.createProducts = fn.wrapper(async (req, res, next) => {
  if (req.body) {
    await Products.create(req.body);
  }
  res.status(201).json({
    status: "success",
    message: "Succesfully Created",
  });
});
