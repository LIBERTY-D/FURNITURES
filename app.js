require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const path = require("path");
const pug = require("pug");
const compression = require("compression");
const router = express.Router();
const app = express();

const DB = require("./server");
const userController = require("./CONTROLLERS/userController");
// ERROR HANDLERS
const err = require("./CONTROLLERS/err");
const API = require("./GLOBAL_ERROR/err");
app.set("view engine", "pug");
app.set("views", `${path.join(__dirname, "VIEWS")}`);
// VIEW CONROLLERS
const viewController = require("./CONTROLLERS/viewController");
const productRouter = require("./ROUTERS/productsRouter");
const userRouter = require("./ROUTERS/userRouter");
const reviewRouter = require("./ROUTERS/reviewRouter");
const bookingRouter = require("./ROUTERS/bookingRouter");
const viewsRouter = require("./ROUTERS/viewsRouter");
//PASS INCOMING MESSAGES
app.use(express.json());
// COOKIE PARSER
app.use(cookieParser());
// STATIC FILES
app.use(express.static(`${path.join(__dirname, "PUBLIC")}`));

app.use("furnitures", router);
router.route("/login").get(viewController.login);
router.route("/signUp").get(viewController.signUp);
router
  .route("/User/Account")
  .get(
    userController.authenticate,
    userController.passUser,
    viewController.account
  );
router.route("/User/Forgot").get(viewController.forgotPassword);
// GONNA NEED PARAMS WITH TOKEN
router.route("/User/Reset/resetToken?").get(viewController.resetPassword);
// updateMe
router
  .route("/User/updateMe")
  .patch(
    userController.authenticate,
    userController.uploadPhoto,
    userController.updateMe
  );
router.route("/").get(userController.isLoggedIn, viewController.home);
router.route("/All").get(userController.isLoggedIn, viewController.All);
// VIEW CONTROLLERS
// NEED PARAMS TO GET SINGLE

router
  .route("/Single/:single")
  .get(userController.isLoggedIn, viewController.single);
app.use(productRouter);
app.use(userRouter);
app.use(reviewRouter);
app.use(bookingRouter);
app.use(viewsRouter);
// COMPRESS TEXTS SEND TO CLIENTS
app.use(compression());
app.all("*", (req, res, next) => {
  return next(
    new API(
      `The Resource You Looking for "${req.originalUrl}", does not exist`,
      404
    )
  );
});

// GLOBAL ERROR
app.use(err.errorHandler);
DB(process.env.DB_CONNECTION.replace("<PASSWORD>", process.env.password));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Listening PORT:${PORT}...`);
});
