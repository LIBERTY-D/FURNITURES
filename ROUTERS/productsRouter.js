const express = require("express");
const productsController = require("../CONTROLLERS/products");
const router = express.Router();

router.post("/furnitures/createProducts", productsController.createProducts);
module.exports = router;
