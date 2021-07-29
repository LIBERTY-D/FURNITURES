require("dotenv").config();
const DB = require("../server");
const nodeFetch = require("node-fetch");
const Products = require("../MODELS/products");

const fetched = async (url) => {
  try {
    const response = await nodeFetch(url);
    const data = await response.json();
    const created = await Products.create(data);
    return created;
  } catch (err) {
    console.log(err);
  }
};
DB(process.env.DB_CONNECTION.replace("<PASSWORD>", process.env.password));
if (process.argv[2] === "--import") {
  (async () => await fetched("https://course-api.com/react-store-products"))();
}
