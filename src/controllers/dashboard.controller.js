const { Types } = require("mongoose");
const { SuccessResponse } = require("../core/success.response");
const { Customer } = require("../models/customer.schema");
const { Product } = require("../models/product.schema");
const { ShopWallet } = require("../models/shopWallet.schema");
const { Order } = require("../models/order.schema");
const { Seller } = require("../models/seller.schema");

class DashBoardController {
  get_admin_dashboard_data = async (req, res) => {
    const { id } = req;
    const totalSale = await ShopWallet.aggregate([
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$amount" },
        },
      },
    ]);
    const totalProduct = await Product.find({}).countDocuments();
    const totalOrder = await Order.find({}).countDocuments();
    const totalSeller = await Seller.find({}).countDocuments();
    const recentOrders = await Customer.find({}).limit(5);
    new SuccessResponse({
      message: "Get admin dashboard data successfully",
      data: {
        totalSale: totalSale.length > 0 ? totalSale[0].totalAmount : 0,
        totalProduct,
        totalOrder,
        totalSeller,
        recentOrders,
      },
    }).send(res);
  };
  get_seller_dashboard_data = async (req, res) => {
    const { id } = req.user;
    const seller = await Seller.findOne({ userId: id });

    const totalSale = await ShopWallet.aggregate([
      {
        $match: {
          sellerId: {
            $eq: seller._id,
          },
        },
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$amount" },
        },
      },
    ]);
    const totalProduct = await Product.find({
      sellerId: seller._id,
    }).countDocuments();
    const totalOrder = await Order.find({
      sellerId: seller._id,
    }).countDocuments();
    const totalPendingOrder = await Order.find({
      $and: [
        {
          sellerId: {
            $eq: seller._id,
          },
        },
        {
          orderStatus: {
            $eq: "pending",
          },
        },
      ],
    }).countDocuments();
    const recentsOrders = await Order.find({
      sellerId: new Types.ObjectId(id),
    }).limit(5);
    const revenue = await Order.aggregate([
      {
        $match: {
          sellerId: new Types.ObjectId(id),
        },
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$totalPrice" },
        },
      },
    ]);
    new SuccessResponse({
      message: "Get seller dashboard data successfully",
      data: {
        totalSale: totalSale.length > 0 ? totalSale[0].totalAmount : 0,
        totalProduct,
        totalOrder,
        totalPendingOrder,
        recentsOrders,
      },
    }).send(res);
  };
  get_daily_orders_stats = async (req, res) => {
    const { id } = req.user;
    const seller = await Seller.findOne({ userId: id });
    const stats = await Order.aggregate([
      {
        $match: {
          sellerId: new Types.ObjectId(seller._id),
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$orderDate" },
            month: { $month: "$orderDate" },
            day: { $dayOfMonth: "$orderDate" },
          },
          totalOrders: { $sum: 1 },
          totalAmount: { $sum: "$totalPrice" },
        },
      },
      {
        $project: {
          _id: 0,
          date: {
            $concat: [
              {
                $toString: "$_id.year",
              },
              "-",
              { $toString: "$_id.month" },
              "-",
              { $toString: "$_id.day" },
            ],
          },
          totalOrders: 1,
          totalAmount: 1,
        },
      },
      {
        $sort: {
          date: 1,
        },
      },
    ]);
    console.log(stats);

    new SuccessResponse({
      message: "Get daily orders stats successfully",
      data: stats,
    }).send(res);
  };
  get_sold_product_quantities = async (req, res) => {
    const { sellerId } = req.params;
    const soldQuantities = await Order.aggregate([
      {
        $match: {
          sellerId: new Types.ObjectId(sellerId),
        },
      },
      {
        $unwind: "$products",
      },
      {
        $group: {
          _id: "$products.productId",
          quantity: { $sum: "$products.quantity" },
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "productsDetails",
        },
      },
      {
        $unwind: "$productsDetails",
      },
    ]);

    new SuccessResponse({
      message: "Get sold product quantities successfully",
      data: soldQuantities,
    });
  };
}

module.exports = new DashBoardController();
