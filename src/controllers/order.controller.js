require("dotenv").config();
const moment = require("moment");
const { CustomerOrder } = require("../models/customerOrder.schema");
const { Order } = require("../models/order.schema");
const { Cart } = require("../models/cart.schema");
const { SuccessResponse } = require("../core/success.response");
const { Types } = require("mongoose");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const { ShopWallet } = require("../models/shopWallet.schema");

class OrderController {
  payment_check = async (id) => {
    const order = await Order.findById({ _id: id });
    if (!order) throw new Error("Order not found");
    if (order.paymentStatus === "unpaid") {
      await CustomerOrder.findByIdAndUpdate(
        { _id: id },
        {
          deliveryStatus: "cancelled",
        },
        {
          new: true,
        }
      );
      await Order.updateMany(
        {
          _id: id,
        },
        {
          deliveryStatus: "cancelled",
        }
      );
    }
    return true;
  };
  place_order = async (req, res) => {
    const { price, products, shippingFee, shippingInfo, userId } = req.body;
    let authOrderData = [];
    let cartId = [];
    const tempDate = moment()(Date.now()).format("LLL");
    let customerOrderProducts = [];
    for (let i = 0; i < products.length; i++) {
      const product = products[i].products;
      for (let j = 0; j < product.length; j++) {
        const tempCusProd = product[j].productInfo;
        tempCusProd.quantity = product[j].quantity;
        customerOrderProducts.push(tempCusProd);
        if (product[j]._id) {
          cartId.push(product[j]._id);
        }
      }
    }
    const order = await CustomerOrder.create({
      customerId: userId,
      shippingInfo,
      products: customerOrderProducts,
      price: price + shippingFee,
      paymentStatus: "unpaid",
      deliveryStatus: "pending",
      date: tempDate,
    });
    if (!order) throw new BadRequestError("Order don't created");
    for (let i = 0; i < cartId.length; i++) {
      const product = products[i].products;
      const prdPrice = product[i].price;
      const sellerId = product[i].sellerId;
      let storeProduct = [];
      for (let j = 0; j < product.length; j++) {
        const tempProd = product[j].products;
        tempProd.quantity = product[j].quantity;
        storeProduct.push(tempProd);
      }
      authOrderData.push({
        orderId: order._id,
        sellerId,
        products: storeProduct,
        price: prdPrice,
        paymentStatus: "unpaid",
        shippingInfo: "Main Warehouse",
        deliveryStatus: "pending",
        date: tempDate,
      });
    }
    await Order.insertMany(authOrderData);
    for (let i = 0; i < cartId.length; i++) {
      await Cart.findByIdAndDelete(cartId[i]);
    }
    setTimeout(() => {
      this.payment_check(order._id);
    }, 15000);
    new SuccessResponse({
      message: "Order Placed successfully",
      data: order._id,
    });
  };
  get_customer_dashboard = async (req, res) => {
    const { userId } = req.params;
    const recentOrders = await CustomerOrder.find({
      customerId: new Types.ObjectId(userId),
    }).limit(5);
    const pendingOrder = await CustomerOrder.find({
      customerId: new Types.ObjectId(userId),
      deliveryStatus: "pending",
    }).countDocuments();
    const totalOrder = await CustomerOrder.find({
      customerId: new Types.ObjectId(userId),
      deliveryStatus: "cancelled",
    }).countDocuments();

    new SuccessResponse({
      message: "Get customer dashboard successfully",
      data: {
        recentOrders,
        pendingOrder,
        totalOrder,
      },
    });
  };
  get_orders = async (req, res) => {
    const { customerId, status } = req.params;
    let orders = [];
    if (status !== "all") {
      orders = await CustomerOrder.find({
        customerId: new Types.ObjectId(customerId),
        deliveryStatus: status,
      });
    } else {
      orders = await CustomerOrder.find({
        customerId: new Types.ObjectId(customerId),
      });
    }
    new SuccessResponse({
      message: "Get orders successfully",
      data: orders,
    });
  };
  get_order_details = async (req, res) => {
    const { orderId } = req.params;
    const order = await CustomerOrder.findById({ _id: orderId });
    if (!order) throw new BadRequestError("Order don't found");
    new SuccessResponse({
      message: "Get order details successfully",
      data: order,
    }).send(res);
  };
  get_admin_orders = async (req, res) => {
    let { page, serchValue, parPage } = req.query;
    page = parseInt(page) || 1;
    parPage = parseInt(parPage) || 10;
    const skipPage = parPage * (page - 1);
    if (serchValue) {
    } else {
      const orders = await CustomerOrder.aggregate([
        {
          $lookup: {
            from: "orders",
            localField: "_id",
            foreignField: "orderId",
            as: "suborder",
          },
        },
      ])
        .skip(skipPage)
        .limit(parPage)
        .sort({ createAt: -1 });
      if (!orders) throw new BadRequestError("Orders don't found");
      const totalOrders = await CustomerOrder.aggregate([
        {
          $lookup: {
            from: "orders",
            localField: "_id",
            foreignField: "orderId",
            as: "suborder",
          },
        },
      ]);
      if (!totalOrders) throw new BadRequestError("Total Orders don't found");
      new SuccessResponse({
        message: "Get orders successfully",
        data: { orders, totalOrders },
      }).send(res);
    }
  };
  get_admin_order = async (req, res) => {
    const { orderId } = req.params;
    const order = await CustomerOrder.aggregate([
      {
        $match: {
          _id: new Types.ObjectId(orderId),
        },
      },
      {
        $lookup: {
          from: "orders",
          localField: "_id",
          foreignField: "orderId",
          as: "suborder",
        },
      },
    ]);
    if (!order) throw new BadRequestError("Order don't found");
    new SuccessResponse({
      message: "Get order details successfully",
      data: order,
    }).send(res);
  };
  get_seller_orders = async (req, res) => {
    const { sellerId } = req.params;
    let { page, parPage, serchValue } = req.query;
    page = parseInt(page) || 1;
    parPage = parseInt(parPage) || 10;
    const skipPage = parPage * (page - 1);
    if (serchValue) {
    } else {
      const orders = await Order.find({
        sellerId: new Types.ObjectId(sellerId),
      })
        .skip(skipPage)
        .limit(parPage)
        .sort({ createAt: -1 });
      if (!orders) throw new BadRequestError("Orders don't found");
      const totalOrderss = await Order.find({
        sellerId: new Types.ObjectId(sellerId),
      }).countDocuments();
      if (!totalOrderss) throw new BadRequestError("Total Orders don't found");
      new SuccessResponse({
        message: "Get orders successfully",
        data: { orders, totalOrderss },
      }).send(res);
    }
  };
  get_seller_order = async (req, res) => {
    const { orderId } = req.params;
    const order = await Order.findById({ _id: orderId });
    if (!order) throw new BadRequestError("Order don't found");
    new SuccessResponse({
      message: "Get order details successfully",
      data: order,
    }).send(res);
  };
  create_payment = async (req, res) => {
    const { price } = req.body;
    const payment = await stripe.paymentIntents.create({
      amount: price * 100,
      currency: "vnd",
      automatic_payment_methods: {
        enabled: true,
      },
    });
    if (!payment) throw new BadRequestError("Payment don't created");
    new SuccessResponse({
      message: "Payment created successfully",
      data: payment,
    }).send(res);
  };
  order_confrim = async (req, res) => {
    const { orderId } = req.params;
    await CustomerOrder.findByIdAndUpdate(
      { _id: orderId },
      { paymentStatus: "paid" }
    );
    await Order.updateMany(
      { _id: orderId },
      { paymentStatus: "paid", deliveryStatus: "pending" }
    );
    const cmtOrder = await CustomerOrder.findById({ _id: orderId });
    const time = moment(Date.now()).format("l");
    const splitTime = time.split("/");
    await ShopWallet.create({
      amount: cmtOrder.price,
      month: splitTime[0],
      year: splitTime[1],
    });
    new SuccessResponse({
      message: "Order confrim successfully",
    }).send(res);
  };
}

module.exports = new OrderController();
