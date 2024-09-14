const { Types } = require("mongoose");
const { SuccessResponse } = require("../core/success.response");
const { Customer } = require("../models/customer.schema");
const { Product } = require("../models/product.schema");
const { ShopWallet } = require("../models/shopWallet.schema");
const { Order } = require("../models/order.schema");
const { Seller } = require("../models/seller.schema");
const moment = require("moment");

class DashBoardController {
  get_admin_dashboard_data = async (req, res) => {
    const { id } = req.user;
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
    const recentOrders = await Order.find({}).limit(5);
    console.log(totalSale);
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
    const { date } = req.query;
    console.log(date);
    const seller = await Seller.findOne({ userId: id });

    const selectedDate = date ? moment(date, "YYYY-MM-DD") : moment();
    const day = selectedDate.date();
    const month = selectedDate.month() + 1;
    const year = selectedDate.year();

    const totalSale = await ShopWallet.aggregate([
      {
        $match: {
          sellerId: seller._id,
          day: day,
          month: month,
          year: year,
        },
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$amount" },
        },
      },
    ]);

    const totalSoldProducts = await Order.aggregate([
      {
        $match: {
          sellerId: seller._id,
          createdAt: {
            $gte: selectedDate.startOf("day").toDate(),
            $lte: selectedDate.endOf("day").toDate(),
          },
        },
      },
      {
        $unwind: "$products",
      },
      {
        $group: {
          _id: null,
          totalSold: { $sum: "$products.quantity" },
        },
      },
    ]);

    const totalOrder = await Order.find({
      sellerId: seller._id,
      createdAt: {
        $gte: selectedDate.startOf("day").toDate(),
        $lte: selectedDate.endOf("day").toDate(),
      },
    }).countDocuments();

    // Thống kê số lượng đơn hàng chờ xuất trong ngày
    const totalPendingOrder = await Order.find({
      sellerId: seller._id,
      orderStatus: "pending",
      createdAt: {
        $gte: selectedDate.startOf("day").toDate(),
        $lte: selectedDate.endOf("day").toDate(),
      },
    }).countDocuments();

    // Lấy 5 đơn hàng gần đây trong ngày
    const recentsOrders = await Order.find({
      sellerId: seller._id,
      createdAt: {
        $gte: selectedDate.startOf("day").toDate(),
        $lte: selectedDate.endOf("day").toDate(),
      },
    }).limit(5);

    // Tính toán doanh thu theo ngày
    const revenue = await Order.aggregate([
      {
        $match: {
          sellerId: seller._id,
          createdAt: {
            $gte: selectedDate.startOf("day").toDate(),
            $lte: selectedDate.endOf("day").toDate(),
          },
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
        totalSoldProducts:
          totalSoldProducts.length > 0 ? totalSoldProducts[0].totalSold : 0,
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
  get_top_products = async (req, res) => {
    const { sellerId } = req.params;
    const topSellingProductsPromise = Product.find({
      sellerId,
      status: "published",
    })
      .sort({ sold: -1 })
      .limit(5)
      .exec();

    const topRatedProductsPromise = Product.find({
      sellerId,
      status: "published",
    })
      .sort({ rating: -1 })
      .limit(5)
      .exec();

    const [topSellingProducts, topRatedProducts] = await Promise.all([
      topSellingProductsPromise,
      topRatedProductsPromise,
    ]);

    new SuccessResponse({
      message: "Get top selling products successfully",
      data: {
        topSellingProducts,
        topRatedProducts,
      },
    }).send(res);
  };
}

module.exports = new DashBoardController();
