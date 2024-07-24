const { Types } = require("mongoose");
const { Product } = require("../product.schema");

const findProductByName = async ({ name }) => {
  return await Product.findOne({ name }).lean();
};

const findProductById = async ({ id }) => {
  return await Product.findOne({ _id: id }).lean();
};

const findAllProduct = async ({ sellerId, searchValue, parPage, skipPage }) => {
  let products = [],
    total = 0;
  if (searchValue) {
    products = await Product.find({
      $text: {
        $search: searchValue,
        sellerId: sellerId,
      }
        .skip(skipPage)
        .limit(parseInt(parPage))
        .sort({ createdAt: -1 }),
    }).lean();
    total = await Product.countDocuments({
      $text: {
        $search: searchValue,
        sellerId: sellerId,
      },
    }).countDocuments();
  } else {
    products = await Product.find({
      sellerId: sellerId,
    });

    console.log(products);
    total = await Product.find({
      sellerId: sellerId,
    }).countDocuments();
  }
  return { products, total };
};

module.exports = { findProductByName, findProductById, findAllProduct };
