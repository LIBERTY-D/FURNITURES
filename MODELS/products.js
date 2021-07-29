const mongoose = require("mongoose");
const slug = require("slugify");
products_schema = new mongoose.Schema({
  id: {
    type: String,
  },
  name: {
    type: String,
  },
  price: {
    type: Number,
  },
  image: {
    type: String,
  },
  colors: {
    type: [String],
  },
  company: {
    type: String,
  },
  shipping: {
    type: Boolean,
    default: true,
  },
  description: {
    type: String,
  },
  category: {
    type: String,
  },
});
// products_schema.pre("save", function (next) {
//   console.log("saved");
//   next();
// });
// products_schema.pre(/^find/, function (next) {
//   next();
// });
const Products = mongoose.model("Product", products_schema);
module.exports = Products;
