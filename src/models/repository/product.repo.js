const { product } = require("../../models/product.schema");
const { Types } = require("mongoose");
const {
  getSelectData,
  unGetSelectData,
  convertToObjectId,
} = require("../../utils");

const queryProduct = async ({ query, limit, skip }) => {
  return await product
    .find(query)
    .populate("shop", "name email -_id")
    .skip(skip)
    .limit(limit)
    .lean()
    .exec();
};
const findAllDraftsForShop = async ({ query, limit, skip }) => {
  return await queryProduct({ query, limit, skip });
};

const findAllPublishForShop = async ({ query, limit, skip }) => {
  return await queryProduct({ query, limit, skip });
};

const publishProductByShop = async ({ shop, _id }) => {
  const foundShop = await product.findOne({
    shop: new Types.ObjectId(shop),
    _id: new Types.ObjectId(_id),
  });
  if (!foundShop) return null;
  foundShop.isDraft = false;
  foundShop.isPublished = true;
  const { modifiedCount } = await foundShop.updateOne(foundShop);
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
    .find(
      {
        isDraft: false,
        $text: {
          $search: regex,
        },
      },
      {
        score: {
          $meta: "textScore",
        },
      }
    )
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

const getProductById = async (productId) => {
  return await product.findById({ _id: convertToObjectId(productId) }).lean();
};

const checkProductByServer = async (products) => {
  return await Promise.all(
    products.map(async (product) => {
      const foundProduct = await getProductById(product._id);
      if (foundProduct) {
        return {
          price: foundProduct.price,
          quantity: foundProduct.quantity,
          _id: foundProduct._id,
        };
      }
    })
  );
};

module.exports = {
  findAllDraftsForShop,
  publishProductByShop,
  unPublishproductByShop,
  searchProductsByUser,
  findAllProducts,
  findProduct,
  updateProductById,
  getProductById,
  checkProductByServer,
  findAllPublishForShop,
};
