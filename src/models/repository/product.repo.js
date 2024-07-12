const {
  product,
  electronic,
  clothing,
  book,
  toy,
  furniture,
} = require("../../models/product.schema");
const { Types } = require("mongoose");
const { getSelectData, unGetSelectData } = require("../../utils");
const findAllDraftsForShop = async ({ query, limit, skip }) => {
  return await product
    .find(query)
    .populate("shop", "name email -_id")
    .sort({ updateAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();
};

const publishProductByShop = async ({ shop, _id }) => {
  const foundShop = await product.findOne({
    shop: Types.ObjectId(shop),
    _id: Types.ObjectId(_id),
  });
  if (!foundShop) return null;
  foundShop.isDraft = false;
  foundShop.isPublished = true;
  const { modifiedCount } = await foundShop.update(foundShop);
  return modifiedCount;
};

const unPublishproductByShop = async ({ shop, _id }) => {
  const foundShop = await product.findOne({
    shop: Types.ObjectId(shop),
    _id: Types.ObjectId(_id),
  });
  if (!foundShop) return null;
  foundShop.isDraft = true;
  foundShop.isPublished = false;
  const { modifiedCount } = await foundShop.update(foundShop);
  return modifiedCount;
};

const searchProductsByUser = async ({ keySearch }) => {
  const regex = new RegExp(keySearch);
  const result = await product
    .find({
      isDraft: false,
      $text: {
        $search: regex,
      },

      score: {
        $meta: "textScore",
      },
    })
    .sort({
      score: {
        $meta: "textScore",
      },
    })
    .lean();

  return result;
};

const findAllProducts = async ({ limit, sort, page, filter, select }) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
  const products = await product
    .find(filter)
    .skip(skip)
    .limit(limit)
    .select(getSelectData(select))
    .sort(sortBy)
    .lean();
  return products;
};

const findProduct = async ({ _id, unSelect }) => {
  return await product.findById(_id).select(unGetSelectData(unSelect)).lean();
};

const updateProductById = async ({
  productId,
  bodyUpdate,
  model,
  isNew = true,
}) => {
  return await model
    .findByIdAndUpdate(productId, bodyUpdate, { new: isNew })
    .lean();
};

module.exports = {
  findAllDraftsForShop,
  publishProductByShop,
  unPublishproductByShop,
  searchProductsByUser,
  findAllProducts,
  findProduct,
  updateProductById,
};
