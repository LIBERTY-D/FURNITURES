const mongoose = require("mongoose");

const booking_schema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  userProducts: {
    type: Array,
  },
  dateOfBooking: {
    type: Date,
  },
});
booking_schema.pre("save", function (next) {
  // INSERT DATE WHEN USER BOOKINGS
  this.dateOfBooking = Date.now();
  next();
});
booking_schema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name email",
  });
  next();
});

const Booking = mongoose.model("Booking", booking_schema);
module.exports = Booking;
