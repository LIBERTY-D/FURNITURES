const Reviews = require("../MODELS/reviewModel");
const fn = require("../GLOBAL_ERROR/catchAsync");
const API = require("../GLOBAL_ERROR/err");

const filter = (obj, ...fields) => {
  const newObject = {};
  Object.keys(obj).forEach((el) => {
    const included = fields.includes(el);
    if (included) {
      newObject[el] = obj[el];
    }
  });
  return newObject;
};
module.exports.createReview = fn.wrapper(async (req, res, next) => {
  console.log(req.body);

  if (!req.body.rating || !req.body.review) {
    return next(new API("Can't submit Empty Review Or Rating", 400));
  }
  req.body.user = req.user._id;
  req.body.product = req.params.productId;
  const filtered = filter(req.body, "review", "user", "product", "rating");
  const review = await Reviews.create(filtered);
  res.status(200).json({
    status: "success",
    message: "Review Successfully Created",
    review,
  });
});
module.exports.getReviews = fn.wrapper(async (req, res, next) => {
  const review = await Reviews.find({ user: req.user._id });
  res.status(200).json({
    status: "success",
    message: "Review Successfully Created",
    review,
  });
});
module.exports.removeReview = fn.wrapper(async (req, res, next) => {
  if (!req.user) {
    return next(
      new API("Your are not authourized to perform this action", 400)
    );
  }
  const review = await Reviews.findOneAndDelete({ _id: req.params.reviewId });

  res.status(204).json({
    status: "success",
    message: "Review Successfully Removed",
  });
});
