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
const { CustomerWallet } = require("../models/customerWallet");
const sendEmail = require("../utils/sendEmail");
const {
  customerOrderConfirm,
  sellerOrderConfirm,
  customerOrderAssigned,
  shipperMessage,
} = require("../utils/emailSubject");
const { Seller } = require("../models/seller.schema");

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

  // update_stock_products_in_order = async (req, res) => {
  //   const { orderId } = req.params;

  //   const order = await Order.findById(orderId);
  //   for (let i = 0; i < order.products.length; i++) {
  //     const product = await Product.findById(order.products[i]._id);
  //     const newStock = product.stock - order.products[i].quantity;
  //     const newSold = product.sold + order.products[i].quantity;
  //     await Product.findByIdAndUpdate(order.products[i]._id, {
  //       stock: newStock,
  //       sold: newSold,
  //     });
  //   }

  //   new SuccessResponse({
  //     message: "Update stock products in order successfully",
  //   }).send(res);
  // };

  get_customer_dashboard = async (req, res) => {
    const { userId } = req.params;
    const recentOrders = await Order.find({
      customerId: new Types.ObjectId(userId),
    })
      .limit(5)
      .sort({ createdAt: -1 });
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
        orderStatus: status,
      })
        .skip(skipPage)
        .limit(parPage)
        .sort({ createdAt: -1 });
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
    let { page, parPage, status } = req.query;
    page = parseInt(page) || 1;
    parPage = parseInt(parPage) || 10;
    const skipPage = parPage * (page - 1);
    let ordersQuery = {};

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
    let { page, parPage, searchValue, orderStatus } = req.query;
    page = parseInt(page) || 1;
    parPage = parseInt(parPage) || 10;
    const skipPage = parPage * (page - 1);
    const query = { sellerId };
    let orders = [];

    if (orderStatus && orderStatus !== "all") {
      query.orderStatus = orderStatus;
    }

    if (searchValue) {
      orders = await Order.find({
        ...query,
        $or: [
          { "products.name": { $regex: searchValue, $options: "i" } },
          { "shippingInfo.name": { $regex: searchValue, $options: "i" } },
        ],
      })
        .sort({ createdAt: -1 })
        .skip(skipPage)
        .limit(parPage);
    } else {
      orders = await Order.find(query)
        .sort({ createdAt: -1 })
        .skip(skipPage)
        .limit(parPage);
    }
    if (!orders) throw new BadRequestError("Orders not found");
    const totalOrders = await Order.countDocuments({ sellerId });
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
    const order = await Order.findById(orderId)
      .populate({
        path: "sellerId",
        select: "email",
      })
      .populate({
        path: "customerId",
        select: "email",
      });
    console.log(order);
    if (paymentMethod === "vnPay" || paymentMethod === "wallet") {
      await Order.findByIdAndUpdate(orderId, {
        paymentStatus: "paid",
      });

      const { totalPrice } = order;
      const { sellerId } = order;

      await ShopWallet.create({
        sellerId: sellerId,
        amount: totalPrice - totalPrice * 0.1 - 20000,
        month: moment().format("M"),
        year: moment().format("YYYY"),
        day: moment().format("D"),
      });
      await PlatformWallet.create({
        sellerId: sellerId,
        amount: totalPrice * 0.1 + 15000,
        month: moment().format("M"),
        year: moment().format("YYYY"),
        day: moment().format("D"),
      });
    }

    sendEmail(
      order.customerId.email,
      "Đơn hàng của bạn đã được đặt thành công!",
      customerOrderConfirm(order._id, order.customerId.name)
    );
    const seller = await Seller.findById(order.sellerId).populate({
      "path": "userId",
      select: "email",
    });
    sendEmail(
      seller.userId.email,
      "Bạn có một đơn hàng mới!",
      sellerOrderConfirm(order._id, seller.shopInfo.shopName)
    );

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

  received_order = async (req, res) => {
    const { orderId } = req.params;
    const order = await Order.findByIdAndUpdate(orderId, {
      orderStatus: "completed",
    });
    if (!order) throw new BadRequestError("Order not found");
    new SuccessResponse({
      message: "Get order details successfully",
      data: order,
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
        orderStatus: "waiting_receive",
        shipperId: shipperId,
        assignedDate: Date.now(),
      }
    );
    const ordersAssigned = await Order.find({
      _id: { $in: validOrderIds },
    })
      .populate({ path: "customerId", select: "email name" })
      .populate({ path: "shipperId", select: "email name" })
      .populate({ path: "sellerId", select: "shopInfo" });

    if (updatedOrders.modifiedCount === 0) {
      throw new BadRequestError("Không có đơn hàng nào được cập nhật");
    }

    if (ordersAssigned.length > 0) {
      const { sellerId } = ordersAssigned[0];
      for (const order of ordersAssigned) {
        sendEmail(
          order.customerId.email,
          "Đơn hàng đã được cung cấp cho shipper",
          customerOrderAssigned(order._id, order.customerId.name)
        );
      }
      const shipper = await Shipper.findById(shipperId);
      sendEmail(
        shipper.email,
        "Đơn hàng đã được cung cấp cho shipper",
        shipperMessage(
          shipper.name,
          ordersAssigned.length,
          sellerId.shopInfo.shopName
        )
      );
    }

    new SuccessResponse({
      message: "Đơn hàng đã được giao thành công cho shipper",
      data: ordersAssigned,
    }).send(res);
  };

  cancel_order = async (req, res) => {
    const { orderId } = req.params;

    const order = await Order.findById({ _id: orderId });

    if (!order) throw new BadRequestError("Order not found");
    if (order.orderStatus === "cancelled") {
      throw new BadRequestError(
        "Cannot cancel an order that has already been cancelled"
      );
    }
    if (order.orderStatus === "processing") {
      throw new BadRequestError(
        "Cannot cancel an order that is in processing status"
      );
    }
    if (order.paymentStatus === "paid") {
      const amountToRefund = order.totalPrice - 40000;
      await CustomerWallet.create({
        customerId: order.customerId,
        amount: amountToRefund,
        day: new Date().getDate(),
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
      });
      await PlatformWallet.create({
        sellerId: order.sellerId,
        amount: -(order.totalPrice * 0.1) + 20000,
        day: new Date().getDate(),
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
      });
      await ShopWallet.create({
        sellerId: order.sellerId,
        amount: -(order.totalPrice * 0.9) + 20000,
        day: new Date().getDate(),
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
      });
    }

    await Order.findByIdAndUpdate(
      orderId,

      { orderStatus: "cancelled" },
      { new: true }
    );
    new SuccessResponse({
      message: "Order cancelled successfully",
    }).send(res);
  };
  accept_orders = async (req, res) => {
    const { orderIds } = req.body;
    const processedOrders = [];
    const failedOrders = [];

    for (let i = 0; i < orderIds.length; i++) {
      const orderId = orderIds[i];

      try {
        const order = await Order.findById({ _id: orderId });

        if (!order) {
          failedOrders.push({ orderId, message: "Đơn hàng không tồn tại" });
          continue;
        }

        if (order.orderStatus === "processing") {
          failedOrders.push({
            orderId,
            message: "Không thể chấp nhận đơn hàng đang ở trạng thái xử lý",
          });
          continue;
        }

        let products = order.products;
        const insufficientStockProducts = [];

        for (let j = 0; j < products.length; j++) {
          const productId = products[j]._id;
          const quantityOrdered = products[j].quantity;

          const product = await Product.findById(productId);

          if (!product) {
            failedOrders.push({
              orderId,
              message: `Sản phẩm không tồn tại với id: ${productId}`,
            });
            continue;
          }

          if (product.stock < quantityOrdered) {
            insufficientStockProducts.push(productId);
          }
        }

        if (insufficientStockProducts.length > 0) {
          // Nếu tất cả sản phẩm bị hết hàng, xóa đơn hàng và gửi email thông báo hủy đơn
          if (products.length === 1) {
            await Order.findByIdAndDelete(orderId);

            failedOrders.push({
              orderId,
              message: "Đơn hàng đã bị xóa do thiếu hàng",
            });

            // Gửi email thông báo hủy đơn
            await sendEmail(
              order.customerId.email,
              "Đơn hàng của bạn đã bị hủy",
              orderCancelled(orderId)
            );
            continue;
          } else {
            // Nếu một số sản phẩm bị hết hàng, xóa sản phẩm khỏi đơn hàng và gửi email thông báo
            products = products.filter(
              (product) => !insufficientStockProducts.includes(product._id)
            );
            await Order.findByIdAndUpdate(
              { _id: orderId },
              { products: products },
              { new: true }
            );

            // Gửi email thông báo xóa sản phẩm khỏi đơn hàng
            await sendEmail(
              order.customerId.email,
              "Một số sản phẩm trong đơn hàng đã bị xóa",
              productRemoved(orderId, insufficientStockProducts)
            );
          }
        }

        for (let j = 0; j < products.length; j++) {
          const productId = products[j]._id;
          const quantityOrdered = products[j].quantity;

          const product = await Product.findById(productId);

          // Trừ số lượng sản phẩm trong kho
          if (product && product.stock >= quantityOrdered) {
            await Product.findByIdAndUpdate(
              productId,
              { $inc: { stock: -quantityOrdered } },
              { new: true }
            );
          }
        }

        const processedOrder = await Order.findByIdAndUpdate(
          { _id: orderId },
          { orderStatus: "processing" },
          { new: true }
        );

        processedOrders.push(processedOrder);
      } catch (error) {
        failedOrders.push({ orderId, message: error.message });
      }
    }

    new SuccessResponse({
      message: "Quá trình chấp nhận đơn hàng hoàn tất",
      data: {
        processedOrders,
        failedOrders,
      },
    }).send(res);
  };
}

module.exports = new OrderController();
