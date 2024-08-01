require("dotenv").config();
const moment = require("moment");
const { Order } = require("../models/order.schema");
const { Cart } = require("../models/cart.schema");
const { SuccessResponse } = require("../core/success.response");
const { Types } = require("mongoose");
const { ShopWallet } = require("../models/shopWallet.schema");
const { BadRequestError } = require("../core/error.response");

class OrderController {
  place_order = async (req, res) => {
    const { price, products, shipping_fee, shippingInfo, userId } = req.body;
    let cartId = [];
    const tempDate = moment(Date.now()).format("LLL");
    const shopOrders = {};

    // Xử lý sản phẩm và phân loại theo cửa hàng
    for (let i = 0; i < products.length; i++) {
      const product = products[i].products;
      const prdPrice = products[i].price;
      const sellerId = products[i].sellerId;

      if (!shopOrders[sellerId]) {
        shopOrders[sellerId] = {
          products: [],
          price: 0,
        };
      }

      for (let j = 0; j < product.length; j++) {
        const tempProd = product[j].productInfo;
        tempProd.quantity = product[j].quantity;
        shopOrders[sellerId].products.push(tempProd);
        if (product[j]._id) {
          cartId.push(product[j]._id);
        }
      }

      // Cộng giá của đơn hàng cho cửa hàng hiện tại
      shopOrders[sellerId].price += prdPrice;
    }

    // Tạo các đơn hàng riêng biệt cho từng cửa hàng
    const orderPromises = Object.keys(shopOrders).map(async (sellerId) => {
      console.log(sellerId);
      const order = await Order.create({
        customerId: userId,
        shippingInfo,
        products: shopOrders[sellerId].products,
        totalPrice: shopOrders[sellerId].price + parseInt(shipping_fee),
        orderDate: tempDate,
        sellerId,
      });

      if (!order)
        throw new BadRequestError("Order not created for seller " + sellerId);

      return order;
    });

    const orders = await Promise.all(orderPromises);

    // Xóa các sản phẩm trong giỏ hàng
    for (let i = 0; i < cartId.length; i++) {
      await Cart.findByIdAndDelete(cartId[i]);
    }

    // Gửi phản hồi thành công
    new SuccessResponse({
      message: "Orders Placed successfully",
      data: orders.map((order) => order._id),
    }).send(res);
  };

  get_customer_dashboard = async (req, res) => {
    const { userId } = req.params;
    const recentOrders = await Order.find({
      customerId: new Types.ObjectId(userId),
    }).limit(5);
    const totalOrder = await Order.find({
      customerId: new Types.ObjectId(userId),
    }).countDocuments();
    const pendingOrder = await Order.find({
      customerId: new Types.ObjectId(userId),
      deliveryStatus: "pending",
    }).countDocuments();
    const cancelledOrder = await Order.find({
      customerId: new Types.ObjectId(userId),
      deliveryStatus: "cancelled",
    }).countDocuments();

    new SuccessResponse({
      message: "Get customer dashboard successfully",
      data: {
        recentOrders,
        pendingOrder,
        cancelledOrder,
        totalOrder,
      },
    }).send(res);
  };
  get_orders = async (req, res) => {
    const { userId, status } = req.params;
    let orders = [];
    if (status !== "all") {
      orders = await Order.find({
        customerId: new Types.ObjectId(userId),
        deliveryStatus: status,
      });
    } else {
      orders = await Order.find({
        customerId: new Types.ObjectId(userId),
      });
    }
    new SuccessResponse({
      message: "Get orders successfully",
      data: orders,
    }).send(res);
  };
  get_order_details = async (req, res) => {
    const { orderId } = req.params;
    const order = await Order.findById({ _id: orderId });
    if (!order) throw new BadRequestError("Order don't found");
    new SuccessResponse({
      message: "Get order details successfully",
      data: order,
    }).send(res);
  };
  get_admin_orders = async (req, res) => {
    let { page, searchValue, parPage } = req.query;
    page = parseInt(page) || 1;
    parPage = parseInt(parPage) || 10;
    const skipPage = parPage * (page - 1);

    let orders;
    if (searchValue) {
      orders = await Order.find({
        $or: [
          { "products.name": { $regex: searchValue, $options: "i" } },
          // Thêm các trường tìm kiếm khác nếu cần
        ],
      })
        .skip(skipPage)
        .limit(parPage)
        .sort({ orderDate: -1 });
    } else {
      orders = await Order.find({})
        .skip(skipPage)
        .limit(parPage)
        .sort({ orderDate: -1 });
    }

    if (!orders) throw new BadRequestError("Orders not found");
    const totalOrders = await Order.countDocuments();

    new SuccessResponse({
      message: "Get orders successfully",
      data: { orders, totalOrders },
    }).send(res);
  };
  get_admin_order = async (req, res) => {
    const { orderId } = req.params;
    const order = await Order.findById(orderId);
    if (!order) throw new BadRequestError("Order not found");
    new SuccessResponse({
      message: "Get order details successfully",
      data: order,
    }).send(res);
  };
  get_seller_orders = async (req, res) => {
    const { sellerId } = req.params;
    let { page, parPage, searchValue } = req.query;
    page = parseInt(page) || 1;
    parPage = parseInt(parPage) || 10;
    const skipPage = parPage * (page - 1);

    let orders;
    if (searchValue) {
      orders = await Order.find({
        sellerId: new Types.ObjectId(sellerId),
        $or: [{ "products.name": { $regex: searchValue, $options: "i" } }],
      })
        .skip(skipPage)
        .limit(parPage)
        .sort({ orderDate: -1 });
    } else {
      orders = await Order.find({
        sellerId: new Types.ObjectId(sellerId),
      })
        .skip(skipPage)
        .limit(parPage)
        .sort({ orderDate: -1 });
    }

    if (!orders) throw new BadRequestError("Orders not found");
    const totalOrders = await Order.countDocuments({
      sellerId: new Types.ObjectId(sellerId),
    });

    new SuccessResponse({
      message: "Get orders successfully",
      data: { orders, totalOrders },
    }).send(res);
  };
  get_seller_order = async (req, res) => {
    const { orderId } = req.params;
    const order = await Order.findById(orderId);
    if (!order) throw new BadRequestError("Order not found");
    new SuccessResponse({
      message: "Get order details successfully",
      data: order,
    }).send(res);
  };

  order_confirm = async (req, res) => {
    const { orderId } = req.params;

    await Order.findByIdAndUpdate(orderId, {
      paymentStatus: "paid",
      orderStatus: "processing",
    });

    const order = await Order.findById(orderId);
    const time = moment(Date.now()).format("l");
    const splitTime = time.split("/");
    console.log(splitTime);
    await ShopWallet.create({
      sellerId: order.sellerId,
      amount: order.totalPrice,
      month: splitTime[0],
      year: splitTime[2],
      day: splitTime[1],
    });

    new SuccessResponse({
      message: "Order confirmed successfully",
    }).send(res);
  };
  admin_order_status_update = async (req, res) => {
    const { orderId } = req.params;
    const { status } = req.body;

    await Order.findByIdAndUpdate(orderId, { orderStatus: status });

    new SuccessResponse({
      message: "Order status updated successfully",
    }).send(res);
  };
  seller_order_status_update = async (req, res) => {
    const { orderId } = req.params;
    const { status } = req.body;

    await Order.findByIdAndUpdate(orderId, { orderStatus: status });

    new SuccessResponse({
      message: "Order status updated successfully",
    }).send(res);
  };
}

module.exports = new OrderController();
