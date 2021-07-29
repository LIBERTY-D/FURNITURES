const express = require("express");
const userController = require("../CONTROLLERS/userController");
const reviewController = require("../CONTROLLERS/reviewController.js");
const router = express.Router();

router.post(
  "/furnitures/furniture/:productId/review",
  userController.authenticate,
  reviewController.createReview
);
router.get(
  "/furnitures/furniture/reviews",
  userController.authenticate,
  reviewController.getReviews
);
router.delete(
  "/furnitures/furniture/reviews/:reviewId",
  userController.authenticate,
  reviewController.removeReview
);
module.exports = router;
