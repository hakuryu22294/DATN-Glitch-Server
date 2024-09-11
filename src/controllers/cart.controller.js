const { Types } = require("mongoose");
const { SuccessResponse } = require("../core/success.response");
const { Cart } = require("../models/cart.schema");
const { find } = require("lodash");
const { Wishlist } = require("../models/wishlist.shema");
const { BadRequestError } = require("../core/error.response");

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
    const { userId } = req.params;

    const cartProducts = await Cart.aggregate([
      {
        $match: {
          userId: new Types.ObjectId(userId),
        },
      },
      {
        $lookup: {
          from: "Products",
          localField: "productId",
          foreignField: "_id",
          as: "products",
        },
      },
      {
        $lookup: {
          from: "Sellers",
          localField: "products.sellerId",
          foreignField: "_id",
          as: "sellerInfo",
        },
      },
    ]);

    let buyItems = 0,
      calcPrice = 0,
      productsCount = 0;

    const outOfStockProduct = cartProducts.filter(
      (p) => p.products[0]?.stock < p.quantity
    );
    productsCount = cartProducts.reduce(
      (total, item) => total + item.quantity,
      0
    );

    const stockProduct = cartProducts.filter(
      (p) => p?.products[0]?.stock >= p.quantity
    );
    calcPrice = stockProduct.reduce((total, item) => {
      const { quantity } = item;
      buyItems += quantity;
      const { price, discount } = item.products[0];
      const discountedPrice = price - Math.floor(price * discount) / 100;
      return total + quantity * (discount !== 0 ? discountedPrice : price);
    }, 0);

    const sellers = stockProduct.reduce((acc, item) => {
      const sellerId = item.products[0].sellerId.toString();
      const existingSeller = acc.find((s) => s.sellerId === sellerId);

      const { price, discount } = item.products[0];
      const pri =
        discount !== 0 ? price - Math.floor(price * discount) / 100 : price;
      const finalPrice = pri;

      const shopName = item.sellerInfo[0]?.shopInfo?.shopName || "Unknown"; // Lấy shopName từ sellerInfo
      console.log("shopName", shopName);
      if (existingSeller) {
        existingSeller.products.push({
          _id: item._id,
          quantity: item.quantity,
          productInfo: item.products[0],
        });
        existingSeller.price += finalPrice * item.quantity;
      } else {
        acc.push({
          sellerId,
          shopName, // Thêm shopName vào kết quả
          price: finalPrice * item.quantity,
          products: [
            {
              _id: item._id,
              quantity: item.quantity,
              productInfo: item.products[0],
            },
          ],
        });
      }
      return acc;
    }, []);

    new SuccessResponse({
      message: "Get cart successfully",
      data: {
        cartProducts: sellers,
        price: calcPrice,
        productsCount,
        shippingFee: 20000 * sellers.length,
        outOfStockProduct,
        buyItems,
      },
    }).send(res);
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
    const product = await Cart.findById(cartId).populate({
      path: "productId",
      select: "stock",
    });
    const { quantity } = product;
    if (quantity > product.productId.stock)
      throw new BadRequestError("Out of stock");
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
    const { productId } = req.body;
    const product = await Wishlist.findOne({ productId });
    console.log(product);
    if (product) throw new BadRequestError("Product already in whishlist");
    const whistList = await Wishlist.create(req.body);
    new SuccessResponse({
      message: "Add whishlist successfully",
      data: whistList,
    }).send(res);
  };
  remove_whishlist = async (req, res) => {
    const { whislistId } = req.params;
    const whistListRemove = await Wishlist.findByIdAndDelete(whislistId);
    if (!whistListRemove) throw new BadRequestError("Whishlist don't found");
    new SuccessResponse({
      message: "Remove whishlist successfully",
      data: whistListRemove,
    }).send(res);
  };
}

module.exports = new CartController();
