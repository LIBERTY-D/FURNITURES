const express = require("express");
const router = express.Router();
const viewsController = require("../CONTROLLERS/viewController");
const userController = require("../CONTROLLERS/userController");

router.get(
  "/furnitures/User/Bookings",
  userController.authenticate,
  viewsController.Booking
);
router.get(
  "/furnitures/User/Reviews",
  userController.authenticate,
  viewsController.Reviews
);
router.get("/furnitures/AboutUs", viewsController.About);
router.get("/furnitures/ContactUs", viewsController.Contact);
module.exports = router;
