const { Types } = require("mongoose");
const { SuccessResponse } = require("../core/success.response");
const { Cart } = require("../models/cart.schema");
const { find } = require("lodash");
const { Wishlist } = require("../models/wishlist.shema");

class CartController {
  async add_to_cart(req, res) {
    const { userId, productId, quantity } = req.body;
    const product = await Cart.findOne({
      $and: [
        {
          productId: {
            $eq: productId,
          },
        },
        {
          userId: {
            $eq: userId,
          },
        },
      ],
    });

    if (product) {
      const updateCart = await Cart.findOneAndUpdate(
        {
          $and: [
            {
              productId: {
                $eq: productId,
              },
            },
            {
              userId: {
                $eq: userId,
              },
            },
          ],
        },
        {
          $set: {
            quantity: quantity,
          },
        }
      );
      new SuccessResponse({
        message: "Update cart successfully",
        data: updateCart,
      }).send(res);
    } else {
      const newCart = await Cart.create({
        userId,
        productId,
        quantity,
      });
      new SuccessResponse({
        message: "Add cart successfully",
        data: newCart,
      }).send(res);
    }
  }

  get_producst_on_cart = async (req, res) => {
    const co = 5;
    const { userId } = req.params;
    const cartProducts = await Cart.aggregate([
      {
        $match: {
          userId: {
            $eq: new Types.ObjectId(userId),
          },
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "productId",
          foreignField: "_id",
          as: "product",
        },
      },
    ]);
    let buyItems = 0,
      calcPrice = 0,
      productsCount = 0;
    const outOfStockProduct = cartProducts.filter(
      (p) => p.product[0].stock < p.quantity
    );
    for (let i = 0; i < cartProducts.length; i++) {
      productsCount = productsCount + cartProducts[i].quantity;
    }
    const stockProduct = cartProducts.filter(
      (p) => p.product[0].stock > p.quantity
    );
    for (let i = 0; i < stockProduct.length; i++) {
      const { quantity } = stockProduct[i];
      productsCount = buyItems + quantity;
      buyItems += quantity;
      const { price, discount } = stockProduct[i].product[0];
      calcPrice += quantity * (price - Math.floor(price * discount) / 100);
      if (discount !== 0) {
        calcPrice += quantity * (price - Math.floor(price * discount) / 100);
      } else {
        calcPrice += quantity * price;
      }
    }
    let p = [];
    let unique = [
      ...new Set(stockProduct.map((p) => p.products[0].sellerId.toString())),
    ];
    for (let i = 0; i < unique.length; i++) {
      let price = 0;
      for (let j = 0; i < stockProduct.length; j++) {
        const tempProduct = stockProduct[j].product[0];
        if (unique[i] === tempProduct.sellerId.toString()) {
          let pri = 0;
          if (tempProduct.discount !== 0) {
            pri =
              tempProduct.price -
              Math.floor(tempProduct.price * tempProduct.discount) / 100;
          } else {
            pri = tempProduct.price;
          }
          pri = pri - Math.floor((pri * co) / 100);
          price = price + pri + stockProduct[j].quantity;
          p[i] = {
            sellerId: unique[i],
            shopName: tempProduct.shopName,
            price,
            products: p[i]
              ? [
                  ...p[i].products,
                  {
                    _id: stockProduct[j]._id,
                    quantity: stockProduct[j].quantity,
                    productInfo: tempProduct,
                  },
                ]
              : [
                  {
                    _id: stockProduct[j]._id,
                    quantity: stockProduct[j].quantity,
                    productInfo: tempProduct,
                  },
                ],
          };
        }
      }
      new SuccessResponse({
        message: "Get cart successfully",
        data: {
          cartProducts: p,
          price: calcPrice,
          productsCount,
          shippingFee: 20 * p.length,
          outOfStockProduct,
          buyItems,
        },
      }).send(res);
    }
  };

  delete_cart = async (req, res) => {
    const { cartId } = req.params;
    const cartRemove = await Cart.findByIdAndDelete(cartId);
    if (!cartRemove) throw new BadRequestError("Cart don't found");
    new SuccessResponse({
      message: "Delete cart successfully",
      data: cartRemove,
    }).send(res);
  };
  quantity_inc = async (req, res) => {
    const { cartId } = req.params;
    const product = await Cart.findById(cartId);
    const { quantity } = product;
    await Cart.findByIdAndUpdate(cartId, { quantity: quantity + 1 });
    new SuccessResponse({
      message: "Quantity increase successfully",
      data: product,
    }).send(res);
  };
  quantity_dec = async (req, res) => {
    const { cartId } = req.params;
    const product = await Cart.findById(cartId);
    const { quantity } = product;
    if (quantity === 1) {
      await Cart.findByIdAndDelete(cartId);
    } else {
      await Cart.findByIdAndUpdate(cartId, { quantity: quantity - 1 });
    }
    new SuccessResponse({
      message: "Quantity update successfully",
      data: product,
    }).send(res);
  };
  get_whishlist = async (req, res) => {
    const { userId } = req.params;
    const whishlist = await Wishlist.find({ userId });
    if (!whishlist) throw new BadRequestError("Whishlist don't found");
    new SuccessResponse({
      message: "Get whishlist successfully",
      data: whishlist,
    }).send(res);
  };
  add_whishlist = async (req, res) => {
    const { userId } = req.params;
    const whishlist = await Wishlist.find({ userId });
    if (!whishlist) throw new BadRequestError("Whishlist don't found");
    new SuccessResponse({
      message: "Get whishlist successfully",
      data: whishlist,
    }).send(res);
  };
  remove_whishlist = async (req, res) => {
    const { whislistId } = req.params;
    const whistListRemove = await Wishlist.findByIdAndDelete(whislistId);
    if (!whistListRemove) throw new BadRequestError("Whishlist don't found");
    new SuccessResponse({
      message: "Remove whishlist successfully",
      data: whistListRemove,
    });
  };
}

module.exports = new CartController();
