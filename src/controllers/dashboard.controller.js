const { Types } = require("mongoose");
const { SuccessResponse } = require("../core/success.response");
const { Customer } = require("../models/customer.schema");
const { Product } = require("../models/product.schema");
const { ShopWallet } = require("../models/shopWallet.schema");
const { Order } = require("../models/order.schema");
const { Seller } = require("../models/seller.schema");
const moment = require("moment");
const { PlatformWallet } = require("../models/platformWallet");
const { updateShopRatings } = require("../models/repo/seller.repo");

class DashBoardController {
  get_admin_dashboard_data = async (req, res) => {
    const { date } = req.query;
    const selectedDate = date ? moment(date, "YYYY-MM-DD") : moment();
    const day = selectedDate.date();
    const month = selectedDate.month() + 1;
    const year = selectedDate.year();
    const startOfDay = selectedDate.startOf("day").toDate();
    const endOfDay = selectedDate.endOf("day").toDate();
    const totalSale = await PlatformWallet.aggregate([
      {
        $match: {
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

    const dailyProductsSold = await Order.aggregate([
      {
        $match: {
          orderDate: {
            $gte: startOfDay,
            $lte: endOfDay,
          },
        },
      },
      {
        $unwind: "$products",
      },
      {
        $group: {
          _id: null,
          totalProducts: { $sum: "$products.quantity" },
        },
      },
    ]);

    const completedOrders = await Order.countDocuments({
      orderStatus: "completed",
      completeDeliveryDate: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    });

    const dailyOrders = await Order.countDocuments({
      orderDate: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    });
    console.log(dailyOrders);
    console.log(startOfDay, endOfDay);

    const recentOrders = await Order.find({}).sort({ createdAt: -1 }).limit(5);

    new SuccessResponse({
      message: "Get admin dashboard data successfully",
      data: {
        totalSale: totalSale.length > 0 ? totalSale[0].totalAmount : 0,
        dailyProductsSold:
          dailyProductsSold.length > 0 ? dailyProductsSold[0].totalProducts : 0,
        dailyOrders,
        recentOrders,
        completedOrders,
      },
    }).send(res);
  };
  get_seller_dashboard_data = async (req, res) => {
    const { id } = req.user;
    const { date } = req.query;
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
    })
      .populate({ path: "customerId", select: "name email" })
      .limit(5)
      .sort({ createdAt: -1 });

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
  get_daily_platform_wallet_stats = async (req, res) => {
    const stats = await PlatformWallet.aggregate([
      {
        $group: {
          _id: {
            year: "$year",
            month: "$month",
            day: "$day",
          },
          totalAmount: { $sum: "$amount" },
        },
      },
      {
        $project: {
          _id: 0,
          date: {
            $concat: [
              { $toString: "$_id.year" },
              "-",
              { $toString: "$_id.month" },
              "-",
              { $toString: "$_id.day" },
            ],
          },
          totalAmount: 1,
        },
      },
      {
        $sort: {
          date: 1,
        },
      },
    ]);

    new SuccessResponse({
      message: "Get daily wallet stats successfully",
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
  get_products_count_by_category = async (req, res) => {
    const stats = await Product.aggregate([
      {
        $group: {
          _id: "$category",
          totalProducts: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "Categories",
          localField: "_id",
          foreignField: "name",
          as: "categoryDetails",
        },
      },
      {
        $project: {
          _id: 0,
          categoryName: { $arrayElemAt: ["$categoryDetails.name", 0] },
          totalProducts: 1,
        },
      },
    ]);
    new SuccessResponse({
      message: "Get products count by category successfully",
      data: stats,
    }).send(res);
  };
  get_seller_stast_by_admin = async (req, res) => {
    // Tính thống kê cho từng seller
    const sellers = await Seller.aggregate([
      {
        $lookup: {
          from: "Orders",
          localField: "_id",
          foreignField: "sellerId",
          as: "orders",
        },
      },
      {
        $addFields: {
          // Tổng doanh thu
          totalRevenue: {
            $sum: {
              $map: {
                input: "$orders",
                as: "order",
                in: {
                  $cond: [
                    { $eq: ["$$order.paymentStatus", "paid"] },
                    "$$order.totalPrice",
                    0,
                  ],
                },
              },
            },
          },
          // Số lượng đơn hàng hoàn thành
          completedOrders: {
            $size: {
              $filter: {
                input: "$orders",
                as: "order",
                cond: { $eq: ["$$order.orderStatus", "completed"] },
              },
            },
          },
          // Tổng số đơn hàng
          totalOrders: { $size: "$orders" },
        },
      },
      {
        $addFields: {
          // Tỷ lệ hoàn thành
          completionRate: {
            $cond: [
              { $eq: ["$totalOrders", 0] },
              0,
              {
                $multiply: [
                  { $divide: ["$completedOrders", "$totalOrders"] },
                  100,
                ],
              },
            ],
          },
        },
      },
      {
        $project: {
          _id: 1,
          shopInfo: 1,
          avatar: 1,
          totalRevenue: 1,
          completedOrders: 1,
          totalOrders: 1,
          completionRate: 1,
          shopRating: 1,
          status: 1,
        },
      },
    ]);

    console.log("Aggregated sellers:", sellers);

    // Tính tổng số seller
    const totalSellers = await Seller.countDocuments();

    // Tính doanh thu tổng cộng
    const totalRevenue = sellers.reduce(
      (acc, seller) => acc + seller.totalRevenue,
      0
    );

    const averageCompletionRate =
      totalSellers > 0
        ? sellers.reduce((acc, seller) => acc + seller.completionRate, 0) /
          totalSellers
        : 0;

    new SuccessResponse({
      message: "Get seller statistics successfully",
      data: {
        totalSellers,
        totalRevenue,
        averageCompletionRate,
        sellers,
      },
    }).send(res);
  };
  get_top_sellers_dashboard = async (req, res) => {
    updateShopRatings();
    const topRatedSellers = await Seller.find({ status: "active" })
      .sort({ shopRatting: -1 })
      .limit(5)
      .select("shopInfo.shopName shopRatting avatar shopInfo.address");

    const topRevenueSellers = await PlatformWallet.aggregate([
      {
        $group: {
          _id: "$sellerId",
          totalRevenue: { $sum: "$amount" },
        },
      },
      {
        $sort: { totalRevenue: -1 },
      },
      {
        $limit: 5,
      },
      {
        $lookup: {
          from: "Sellers",
          localField: "_id",
          foreignField: "_id",
          as: "shopInfo",
        },
      },
      {
        $unwind: "$shopInfo",
      },
      {
        $project: {
          _id: 0,
          sellerId: "$_id",
          totalRevenue: 1,
          shopInfo: {
            shopName: "$shopInfo.shopInfo.shopName",
            status: "$shopInfo.status",
            avatar: "$shopInfo.avatar",
            address: "$shopInfo.shopInfo.address",
          },
        },
      },
    ]);

    new SuccessResponse({
      message: "Get top seller statistics successfully",
      data: {
        topRatedSellers,
        topRevenueSellers,
      },
    }).send(res);
  };
}

module.exports = new DashBoardController();
