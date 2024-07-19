const { convertToObjectId } = require("../../utils");
const { Inventory } = require("../inventory.shema");

const insertInventory = async ({
  productId,
  shopId,
  stock,
  location = "unknow",
}) => {
  return await Inventory.create({
    product: productId,
    shop: shopId,
    stock,
    location,
  });
};

const reservationInventory = async ({ productId, quantity, cartId }) => {
  const query = {
      product: convertToObjectId(productId),
      stock: { $gte: quantity },
    },
    updateSet = {
      $inc: {
        stock: -quantity,
      },
      $push: {
        reservation: {
          quantity,
          cartId,
          createOn: new Date(),
        },
      },
    },
    options = {
      upsert: true,
      new: true,
    };

  return await Inventory.updateOne(query, updateSet, options);
};

module.exports = {
  insertInventory,
  reservationInventory,
};
