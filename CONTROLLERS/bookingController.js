const stripe = require("stripe")(process.env.STRIPE_SECRET);
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
  // Booking.create({ user: req.user._id, userProducts: userProducts(req) });

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    customer_email: req.user.email,
    client_reference_id: JSON.stringify(req.user._id),
    metadata: {
      userProducts: JSON.stringify(userProducts(req)),
    },
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
    success_url: `${req.protocol}://${req.get("host")}/furnitures/All`,
    cancel_url: `${req.protocol}://${req.get("host")}/furnitures/All`,
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
module.exports.webhook = async (req, res, next) => {
  const signature = req.headers["stripe-signature"];
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.endpointSecret
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed":
      await Booking.create({
        user: event.data.object.client_reference_id,
        userProducts: JSON.parse(event.data.object.metadata.userProducts),
      });
      break;
    case "payment_intent.succeeded":
      const paymentIntent = event.data.object;
      console.log("PaymentIntent was successful!");
      break;
    case "payment_method.attached":
      const paymentMethod = event.data.object;
      console.log("PaymentMethod was attached to a Customer!");
      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a response to acknowledge receipt of the event
  res.json({ received: true });
  // Handle the event
  // if (event.type === "checkout.session.completed") {
  //   await Booking.create({
  //     user: event.data.object.client_reference_id,
  //     userProducts: JSON.parse(event.data.object.metadata.userProducts),
  //   });
  // }
};
