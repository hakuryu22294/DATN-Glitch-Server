const CartService = require("../services/cart.service");

class CartController {
  /**
   *
   */

  addToCart = async (req, res, next) => {
    new SuccessResponse({
      message: "Add product to cart successfully",
      metadata: await CartService.addToCart({
        userId: req.user.userId,
        product: req.body,
      }),
    }).send(res);
  };
  updateCart = async (req, res, next) => {
    new SuccessResponse({
      message: "Update cart successfully",
      metadata: await CartService.updateCart(req.body),
    }).send(res);
  };
  listToCart = async (req, res, next) => {
    new SuccessResponse({
      message: "Get list cart successfully",
      metadata: await CartService.listToCart(req.query),
    }).send(res);
  };
  deleteToCart = async (req, res, next) => {
    new SuccessResponse({
      message: "Delete cart successfully",
      metadata: await CartService.deleteToCart({
        userId: req.user.userId,
        product: req.body,
      }),
    }).send(res);
  };
}

module.exports = new CartController();
