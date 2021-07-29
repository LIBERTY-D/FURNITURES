const express = require("express");
const router = express.Router();
const userController = require("../CONTROLLERS/userController");
const bookingController = require("../CONTROLLERS/bookingController");

router.post(
  "/furnitures/bookings",
  userController.authenticate,
  bookingController.createBooking
);
router.get(
  "/furnitures/bookings",
  userController.authenticate,
  bookingController.getBooking
);
router.get(
  "/furnitures/bookings/User",
  userController.authenticate,
  bookingController.getBooking
);
module.exports = router;
