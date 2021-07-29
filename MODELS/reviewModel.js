const mongoose = require("mongoose");

const review_schema = new mongoose.Schema(
  {
    review: {
      type: [String],
      required: [true, "Cannot sent empty review"],
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      required: [true, "Rating is required"],
    },
    createdAt: {
      type: Date,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    product: {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
// MAKES SURE THAT USER CANNOT MAKE ONE OR MORE REVIEWS FOR THE SAME PRODUCT
review_schema.index(
  { user: 1, product: 1 },
  {
    dropDups: true,
  }
);
review_schema.pre("save", function (next) {
  this.createdAt = Date.now();
  next();
});
review_schema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "username image",
  }).populate({
    path: "product",
  });
  next();
});
const Review = mongoose.model("Review", review_schema);
module.exports = Review;
