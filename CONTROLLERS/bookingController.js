var stripe = require("stripe")(process.env.STRIPE_SECRET);
const Booking = require("../MODELS/bookingModel");
const fn = require("../GLOBAL_ERROR/catchAsync");
function itemsCount(products) {
  let { total, count } = products.reduce(
    (total, current) => {
      total.count += current.count;
      total.total += current.price * 1 * current.count;

      return total;
    },
    {
      total: 0,
      count: 0,
    }
  );

  return { total, count };
}
const userProducts = (req) => {
  let cartContents = req.body.map((el) => {
    const { name, price, img, count, id } = el;
    return {
      name,
      currency: "usd",
      image: img,
      //   PRICE TIMES ONE TO CONVERT TO NUMBER
      price_total: price * 1 * count,
      quantity: count,
      id,
    };
  });
  return cartContents;
};
module.exports.createBooking = fn.wrapper(async (req, res, next) => {
  const { total, count } = itemsCount(req.body);
  Booking.create({ user: req.user._id, userProducts: userProducts(req) });
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    customer_email: req.user.email,
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: "Total Shopping Bag Amount",
          },
          unit_amount: Math.ceil(total) * 100,
        },
        quantity: 1,
      },
    ],
    success_url: `/furnitures/All`,
    cancel_url: `/furnitures/All`,
  });
  res.status(200).json({
    status: "success",
    message: "booking successfully created",
    session,
  });
});
module.exports.getBooking = fn.wrapper(async (req, res, next) => {
  const userProducts = await Booking.find({
    user: req.user._id,
  });
  res.status(200).json({
    status: "success",
    message: "Success Acccess Your Bookings",
    userProducts,
  });
});
