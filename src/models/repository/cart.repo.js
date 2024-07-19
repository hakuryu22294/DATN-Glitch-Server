const { convertToObjectId } = require("../../utils");
const { Cart } = require("../cart.schema");

const findCartById = async (cartId) => {
  return await Cart.findOne({
    _id: convertToObjectId(cartId),
    state: "active",
  }).lean();
};

module.exports = {
  findCartById,
};
