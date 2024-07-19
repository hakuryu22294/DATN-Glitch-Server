// {
//     cartId,
//     userId,
//     shopOrderIds:[
//         {
//             shopId,
//             shopDiscount:[],
//             products:[{
//                 price,
//                 quantity,
//                 productId
//             }]
//         },

const { BadRequestError } = require("../core/error.response");
const { Order } = require("../models/order.schema");
const { findCartById } = require("../models/repository/cart.repo");
const { checkProductByServer } = require("../models/repository/product.repo");
const { getDiscountAmount } = require("./discount.service");
const { acquireLock, realeaseLock } = require("./redis.service");

//     ]
// }
class CheckOutService {
  static async checkoutReview({ cartId, userId, shopOrderIds = [] }) {
    //check cart id is exists
    const foundCart = await findCartById(cartId);
    if (!foundCart) throw new BadRequestError("Cart does not exists");
    const checkoutOrder = {
        totalPrice: 0,
        freeShip: 0,
        totalDiscount: 0,
        totalCheckout: 0,
      },
      shopOderIdsNew = [];

    for (let i = 0; i < shopOrderIds.length; i++) {
      const { shopId, shopDiscounts = [], products = [] } = shopOrderIds[i];
      const checkProductServer = await checkProductByServer(products);
      if (!checkProductServer[0])
        throw new BadRequestError("Order wrong product");
      const checkoutPrice = checkProductServer.reduce((acc, product) => {
        return acc + product.price * product.quantity;
      }, 0);
      checkoutOrder.totalPrice += checkoutPrice;
      const itemCheckout = {
        shopId,
        shopDiscounts,
        priceRaw: checkoutPrice,
        priceApplyDiscount: checkoutPrice,
        products: products,
      };
      if (shopDiscounts.length > 0) {
        const { totalPrice = 0, discount = 0 } = await getDiscountAmount({
          codeId: shopDiscounts[0].codeId,
          userId,
          shopId,
          products,
        });
        checkoutOrder.totalDiscount += discount;
        if (discount > 0) {
          itemCheckout.priceApplyDiscount = checkoutPrice - discount;
        }
      }
      checkoutOrder.totalCheckout += itemCheckout.priceApplyDiscount;
    }

    return {
      shopOrderIds,
      shopOderIdsNew,
      checkoutOrder,
    };
  }

  static async orderByUser({
    shopOrderIds,
    cartId,
    userId,
    userAddress = {},
    userPayment = {},
  }) {
    const { shopOrderIdsNew, checkoutOrder } =
      await CheckOutService.checkoutReview({
        cartId,
        userId,
        shopOrderIds,
      });
    const product = shopOrderIdsNew.flatMap((order) => order.products);
    const acquireProduct = [];
    for (let i = 0; i < product.length; i++) {
      const { _id, quantity } = product[i];
      const keyLock = await acquireLock(_id, quantity, cartId);
      acquireProduct.push(keyLock ? true : false);
      if (keyLock) {
        await realeaseLock(keyLock);
      }
    }
    if (acquireProduct.includes(false))
      throw new BadRequestError(
        "Some products have been updated, please return to the cart"
      );
    const newOrder = await Order.create({
      user: userId,
      checkout: checkoutOrder,
      shipping: userAddress,
      payment: userPayment,
      products: shopOrderIdsNew,
    });
    if (newOrder) {
      //remove product in my cart
    }
    return newOrder;
  }
  /**
   * Query order
   */
  static async getOrdersByUser() {}
  static async getOneOrdersByUser() {}
  static async cancelOrdersByUser() {}
  static async updateOrderStatusByShop() {}
}
module.exports = CheckOutService;
