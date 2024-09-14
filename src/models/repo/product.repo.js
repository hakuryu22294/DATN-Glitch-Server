const { Types } = require("mongoose");
const { Product } = require("../product.schema");

const findProductByName = async ({ name }) => {
  return await Product.findOne({ name }).lean();
};

const findProductById = async (id) => {
  return await Product.findOne({ _id: id }).lean();
};

const findAllProduct = async ({
  sellerId,
  searchValue,
  parPage,
  skipPage,
  status,
  subCategory,
}) => {
  let products = [],
    total = 0;

  const query = { sellerId };

  if (status) {
    query.status = status;
  }

  if (subCategory) {
    query.subCategory = subCategory;
  }

  if (searchValue) {
    query.$text = { $search: searchValue };
  }

  products = await Product.find(query)
    .skip(skipPage)
    .limit(parseInt(parPage))
    .sort({ createdAt: -1 });

  total = await Product.countDocuments(query);

  return { products, total };
};

module.exports = { findProductByName, findProductById, findAllProduct };
