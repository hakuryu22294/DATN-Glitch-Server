const { Types } = require("mongoose");
const { SuccessResponse } = require("../core/success.response");
const { Cart } = require("../models/cart.schema");
const { find } = require("lodash");
const { Wishlist } = require("../models/wishlist.shema");
const { BadRequestError } = require("../core/error.response");
const { Product } = require("../models/product.schema");

class CartController {
  async add_to_cart(req, res) {
    const { userId, productId, quantity } = req.body;

    const product = await Product.findOne({
      _id: productId,
      status: "published",
      stock: { $gt: 0 },
    });

    if (!product) {
      throw new BadRequestError("Sản phẩm không tồn tại hoặc đã hết hàng");
    }

    const existingCartItem = await Cart.findOne({
      userId,
      productId,
    });

    if (existingCartItem) {
      const updateCart = await Cart.findOneAndUpdate(
        { userId, productId },
        { $set: { quantity } },
        { new: true }
      );
      new SuccessResponse({
        message: "Cập nhật giỏ hàng thành công",
        data: updateCart,
      }).send(res);
    } else {
      const newCart = await Cart.create({
        userId,
        productId,
        quantity,
      });
      new SuccessResponse({
        message: "Thêm sản phẩm vào giỏ hàng thành công",
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
        $unwind: "$products",
      },
      {
        $match: {
          "products.status": "published",
          "products.stock": { $gt: 0 },
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

    // Lọc các sản phẩm hết hàng trong giỏ hàng
    const outOfStockProduct = cartProducts.filter(
      (p) => p.products.stock < p.quantity
    );

    // Lọc các sản phẩm còn hàng trong giỏ hàng
    const stockProduct = cartProducts.filter(
      (p) => p.products.stock >= p.quantity
    );

    // Tính toán lại productsCount chỉ dựa trên sản phẩm còn hàng
    productsCount = stockProduct.reduce(
      (total, item) => total + item.quantity,
      0
    );

    calcPrice = stockProduct.reduce((total, item) => {
      const { quantity } = item;
      buyItems += quantity;
      const { price, discount } = item.products;
      const discountedPrice = price - Math.floor(price * discount) / 100;
      return total + quantity * (discount !== 0 ? discountedPrice : price);
    }, 0);

    const sellers = stockProduct.reduce((acc, item) => {
      const sellerId = item.products.sellerId.toString();
      const existingSeller = acc.find((s) => s.sellerId === sellerId);

      const { price, discount } = item.products;
      const pri =
        discount !== 0 ? price - Math.floor(price * discount) / 100 : price;
      const finalPrice = pri;

      const shopName = item.sellerInfo[0]?.shopInfo?.shopName || "Unknown";
      console.log("shopName", shopName);
      if (existingSeller) {
        existingSeller.products.push({
          _id: item._id,
          quantity: item.quantity,
          productInfo: item.products,
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
              productInfo: item.products,
            },
          ],
        });
      }
      return acc;
    }, []);

    new SuccessResponse({
      message: "Lấy giỏ hàng thành công",
      data: {
        cartProducts: sellers,
        price: calcPrice,
        productsCount, // Đã sửa productsCount để chỉ tính sản phẩm còn hàng
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
    const whishlist = await Wishlist.find({ userId }).populate({
      path: "productId",
      select: "stock name price slug",
    });
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
  check_cart_before_buy = async (req, res) => {
    const { cartItems } = req.body;

    const insufficientStockItems = [];
    const unavailableItems = [];

    for (const cartItem of cartItems) {
      const { products, shopName } = cartItem;

      for (const item of products) {
        const { quantity, productInfo } = item;
        console.log(productInfo);
        const productId = productInfo._id;
        console.log("productId", productId);

        // Tìm sản phẩm trong cơ sở dữ liệu
        const product = await Product.findOne({
          _id: productId,
          status: "published",
        });
        console.log(product);
        if (!product) {
          unavailableItems.push({ productId, shopName });
          console.log("unavailableItems", unavailableItems);
          continue;
        }

        if (product.stock < quantity) {
          insufficientStockItems.push({
            productId,
            shopName,
            availableStock: product.stock,
            requestedQuantity: quantity,
          });
        }
      }
    }

    // Trả về kết quả kiểm tra
    if (unavailableItems.length > 0) {
      return res.status(404).json({
        message: "Các sản phẩm sau đây không còn tồn tại",
        unavailableItems,
      });
    }
    if (insufficientStockItems.length > 0) {
      return res.status(400).json({
        message: "Một số sản phẩm trong giỏ hàng không đủ số lượng",
        insufficientStockItems,
      });
    }

    return res
      .status(200)
      .json({ message: "Tất cả sản phẩm trong giỏ hàng đều hợp lệ" });
  };
}

module.exports = new CartController();
