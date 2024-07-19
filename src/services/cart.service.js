/**
 * - Add product to cart [user]
 * - reduce product quantity by one [user]
 * - increase product quantity by one [user]
 * - get cart [user]
 * - delete cart [user]
 * - delete product from cart [user]
 *
 */

const { NotFoundError } = require("../core/error.response");
const { Cart } = require("../models/cart.schema");
const { getProductById } = require("../models/repository/product.repo");

class CartService {
  static async createUserCart({ userId, product }) {
    const query = { user: userId, state: "active" },
      updateOrInsert = {
        $addToSet: { products: product },
      },
      options = { upsert: true, new: true };

    return await Cart.findOneAndUpdate(query, updateOrInsert, options);
  }

  static async updateUserCartQuantity({ userId, product }) {
    const { _id, quantity } = product;
    const query = { user: userId, state: "active", "products._id": _id },
      updateSet = {
        $inc: {
          "products.$[product].quantity": -1,
        },
      },
      options = {
        upsert: true,
        new: true,
      };
    return await Cart.findOneAndUpdate(query, updateSet, options);
  }
  static async addToCart({ userId, product = {} }) {
    //check cart is exists
    const userCart = await Cart.findOne({
      user: userId,
    });

    if (!userCart) {
      return await CartService.createUserCart({ userId, product });
    }

    if (userCart.products.length === 0) {
      userCart.products = [product];
      return await userCart.save();
    }

    return await CartService.updateUserCartQuantity({ userId, product });
  }

  static async updateCart({ userId, shopOrderIds = {} }) {
    const { _id, quantity, old_quantity } = shopOrderIds[0]?.products[0];
    // check product exists
    const foundProduct = await getProductById(_id);
    if (!foundProduct) {
      throw new NotFoundError("Product not exists");
    }
    if (foundProduct.shop.toString() !== shop[0]?._id) {
      throw new NotFoundError("Product do not belong to shop");
    }
    if (quantity === 0) {
      //delete
    }
    return await CartService.updateUserCartQuantity({
      userId,
      product: {
        _id,
        quantity: quantity - old_quantity,
      },
    });
  }
  static async deleteUserCart({ userId, productId }) {
    const query = { user: userId, state: "active" },
      updateSet = {
        $pull: {
          products: {
            _id: productId,
          },
        },
      };

    const deleteCart = await Cart.updateOne(query, updateSet);
    return deleteCart;
  }
  static async getListUserCart({ userId }) {
    return await Cart.findOne({
      user: userId,
    }).lean();
  }
}

module.exports = CartService;
