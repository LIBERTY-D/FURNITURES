const express = require("express");
const userController = require("../CONTROLLERS/userController");

const router = express.Router();
router.post("/signUp", userController.signUp);
router.post("/login", userController.login);
router.get("/logout", userController.logout);
router.post("/furnitures/ContactUs", userController.Contact);
router.post("/furnitures/User/Reset/resetToken?", userController.reset);
router.post("/furnitures/User/Forgot", userController.forgot);
router.patch(
  "/furnitures/User/changePassword",
  userController.authenticate,
  userController.changePassword
);
module.exports = router;
