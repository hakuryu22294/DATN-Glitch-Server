require("dotenv").config();
const moment = require("moment");
const { Order } = require("../models/order.schema");
const { Cart } = require("../models/cart.schema");
const { SuccessResponse } = require("../core/success.response");
const { Types } = require("mongoose");
const { ShopWallet } = require("../models/shopWallet.schema");
const { BadRequestError } = require("../core/error.response");
const { Product } = require("../models/product.schema");
const { Shipper } = require("../models/shipper.schema");
const mongoose = require("mongoose");
const { PlatformWallet } = require("../models/platformWallet");

class OrderController {
  place_order = async (req, res) => {
    const { price, products, shipping_fee, shippingInfo, userId } = req.body;
    let cartId = [];
    const tempDate = moment(Date.now()).format("LLL");
    const shopOrders = {};
    for (let i = 0; i < products.length; i++) {
      const product = products[i].products;
      const prdPrice = products[i].price;
      const sellerId = products[i].sellerId;
      console.log(prdPrice);
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

      shopOrders[sellerId].price += prdPrice;
      console.log(shopOrders[sellerId].price);
    }
    const orderPromises = Object.keys(shopOrders).map(async (sellerId) => {
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

    for (let i = 0; i < cartId.length; i++) {
      await Cart.findByIdAndDelete(cartId[i]);
    }

    new SuccessResponse({
      message: "Orders Placed successfully",
      data: orders.map((order) => order._id),
    }).send(res);
  };

  update_stock_products_in_order = async (req, res) => {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);
    for (let i = 0; i < order.products.length; i++) {
      const product = await Product.findById(order.products[i]._id);
      const newStock = product.stock - order.products[i].quantity;
      const newSold = product.sold + order.products[i].quantity;
      await Product.findByIdAndUpdate(order.products[i]._id, {
        stock: newStock,
        sold: newSold,
      });
    }

    new SuccessResponse({
      message: "Update stock products in order successfully",
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
      orderStatus: "pending",
    }).countDocuments();
    const cancelledOrder = await Order.find({
      customerId: new Types.ObjectId(userId),
      orderStatus: "cancelled",
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
    const { page, searchValue, parPage } = req.query;
    const skipPage = parseInt(parPage) * (parseInt(page) - 1);
    let orders = [];
    if (status !== "all") {
      orders = await Order.find({
        customerId: new Types.ObjectId(userId),
        deliveryStatus: status,
      });
    } else {
      orders = await Order.find({
        customerId: new Types.ObjectId(userId),
      })
        .skip(skipPage)
        .limit(parPage)
        .sort({ createdAt: -1 });
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
    let { page, searchValue, parPage, status } = req.query;
    page = parseInt(page) || 1;
    parPage = parseInt(parPage) || 10;
    const skipPage = parPage * (page - 1);
    let ordersQuery = {};

    if (status) {
      ordersQuery["orderStatus"] = status;
    }

    if (searchValue) {
      ordersQuery = {
        $and: [
          ordersQuery,
          {
            $or: [
              { "products.name": { $regex: searchValue, $options: "i" } },
              { "shopName": { $regex: searchValue, $options: "i" } },
              { _id: { $regex: searchValue, $options: "i" } },
            ],
          },
        ],
      };
    }

    const orders = await Order.aggregate([
      { $match: ordersQuery },
      { $sort: { orderDate: -1 } },
      {
        $lookup: {
          from: "Sellers",
          localField: "sellerId",
          foreignField: "_id",
          as: "shopDetails",
        },
      },
      { $unwind: "$shopDetails" },
      {
        $group: {
          _id: "$shopDetails._id",
          shopName: { $first: "$shopDetails.shopInfo.shopName" },
          orders: { $push: "$$ROOT" },
        },
      },
      { $sort: { "orders.orderDate": -1 } },
      { $skip: skipPage },
      { $limit: parPage },
    ]);

    const totalOrders = await Order.countDocuments(ordersQuery);

    if (!orders.length) throw new BadRequestError("Không tìm thấy đơn hàng");

    new SuccessResponse({
      message: "Lấy đơn hàng thành công",
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
        sellerId: sellerId,
        $or: [{ "products.name": { $regex: searchValue, $options: "i" } }],
      });
    } else {
      orders = await Order.find({
        sellerId: sellerId,
      });
    }

    if (!orders) throw new BadRequestError("Orders not found");
    const totalOrders = await Order.countDocuments({
      sellerId: sellerId,
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
    const { orderId, paymentMethod } = req.params;
    if (paymentMethod === "vnPay" || paymentMethod === "wallet") {
      await Order.findByIdAndUpdate(orderId, {
        paymentStatus: "paid",
        orderStatus: "processing",
      });
      const order = await Order.findById(orderId);
      const { totalPrice } = order;
      const { sellerId } = order;

      await ShopWallet.create({
        sellerId: sellerId,
        amount: totalPrice - totalPrice * 0.1,
        month: moment().format("M"),
        year: moment().format("YYYY"),
        day: moment().format("D"),
      });
      await PlatformWallet.create({
        amount: totalPrice * 0.1,
        month: moment().format("M"),
        year: moment().format("YYYY"),
        day: moment().format("D"),
      });
    }

    new SuccessResponse({
      message: "Order confirmed successfully",
    }).send(res);
  };
  admin_order_status_update = async (req, res) => {
    const { orderId } = req.params;
    const { status } = req.body;

    const adminOrderStatus = {
      shipped: "shipped",
    };

    await Order.findByIdAndUpdate(orderId, {
      orderStatus: adminOrderStatus[status],
      startDeliveryDate: Date.now(),
    });

    new SuccessResponse({
      message: "Order status updated successfully",
    }).send(res);
  };
  seller_order_status_update = async (req, res) => {
    const { orderId } = req.params;
    const { status } = req.body;
    const sellerOrderStatus = {
      processing: "processing",
      cancelled: "cancelled",
    };
    if (!sellerOrderStatus[status])
      throw new BadRequestError("Status is not valid");
    await Order.findByIdAndUpdate(orderId, {
      orderStatus: sellerOrderStatus[status],
    });

    new SuccessResponse({
      message: "Order status updated successfully",
    }).send(res);
  };

  hand_over_orders_to_shipper = async (req, res) => {
    const { orderIds = [], shipperId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(shipperId)) {
      return new BadRequestError("Shipper ID không hợp lệ");
    }

    if (!Array.isArray(orderIds) || orderIds.length === 0) {
      return new BadRequestError("Không có order ID nào được cung cấp");
    }

    const validOrderIds = orderIds.filter((id) =>
      mongoose.Types.ObjectId.isValid(id)
    );
    if (validOrderIds.length === 0) {
      throw new BadRequestError("Không có Order ID hợp lệ nào được cung cấp");
    }

    const updatedOrders = await Order.updateMany(
      { _id: { $in: validOrderIds } },
      {
        deliveryStatus: "assigned",
        shipperId: shipperId,
        assignedDate: Date.now(),
      }
    );

    if (updatedOrders.modifiedCount === 0) {
      throw new BadRequestError("Không có đơn hàng nào được cập nhật");
    }

    new SuccessResponse({
      message: "Đơn hàng đã được giao thành công cho shipper",
    }).send(res);
  };

  cancel_order = async (req, res) => {
    const { orderId } = req.params;

    const order = await Order.findById({ _id: orderId });

    if (!order) throw new BadRequestError("Order not found");

    if (order.orderStatus === "processing") {
      throw new BadRequestError(
        "Cannot cancel an order that is in processing status"
      );
    }

    await Order.findByIdAndUpdate(
      { _id: orderId },
      { orderStatus: "cancelled" }
    );
    new SuccessResponse({
      message: "Order cancelled successfully",
    }).send(res);
  };
  accept_order = async (req, res) => {
    const { orderId } = req.params;

    const order = await Order.findById({ _id: orderId });

    if (!order) {
      throw new BadRequestError("Order not found");
    }

    if (order.orderStatus === "processing") {
      throw new BadRequestError(
        "Cannot accept an order that is in processing status"
      );
    }

    let products = order.products;
    const insufficientStockProducts = [];

    for (let i = 0; i < products.length; i++) {
      const productId = products[i]._id;
      const quantityOrdered = products[i].quantity;

      const product = await Product.findById(productId);

      if (!product) {
        throw new BadRequestError(`Product not found with id: ${productId}`);
      }

      if (product.stock < quantityOrdered) {
        insufficientStockProducts.push(productId);
      }
    }

    if (insufficientStockProducts.length > 0) {
      if (products.length === 1) {
        await Order.findByIdAndDelete(orderId);
        return new SuccessResponse({
          message: "Order has been deleted due to insufficient stock",
        }).send(res);
      } else {
        products = products.filter(
          (product) => !insufficientStockProducts.includes(product._id)
        );
        await Order.findByIdAndUpdate(
          { _id: orderId },
          { products: products },
          { new: true }
        );
      }
    }

    for (let i = 0; i < products.length; i++) {
      const productId = products[i]._id;
      const quantityOrdered = products[i].quantity;

      await Product.findByIdAndUpdate(
        productId,
        { $inc: { stock: -quantityOrdered } },
        { new: true }
      );
    }

    const processedOrder = await Order.findByIdAndUpdate(
      { _id: orderId },
      { orderStatus: "processing" },
      { new: true }
    );

    new SuccessResponse({
      message: "Order accepted and stock updated successfully",
    }).send(res);
  };
}

module.exports = new OrderController();
