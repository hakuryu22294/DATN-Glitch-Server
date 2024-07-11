const {
  product,
  electronic,
  clothing,
  book,
  toy,
  furniture,
} = require("../../models/product.schema");
const { Types } = require("mongoose");
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
    shop: new Types.ObjectId(shop),
    _id: new Types.ObjectId(_id),
  });
  if (!foundShop) return null;
  foundShop.isDraft = false;
  foundShop.isPublished = true;
  const { modifiedCount } = await foundShop.update(foundShop);
  return modifiedCount;
};

module.exports = { findAllDraftsForShop, publishProductByShop };
