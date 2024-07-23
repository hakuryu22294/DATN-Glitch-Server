const { Types } = require("mongoose");
const { SuccessResponse } = require("../core/success.response");
const { Customer } = require("../models/customer.schema");
const { Product } = require("../models/product.schema");
const { ShopWallet } = require("../models/shopWallet.schema");
const { Order } = require("../models/order.schema");

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
    const totalOrder = await Customer.find({}).countDocuments();
    const totalSeller = await Product.find({}).countDocuments();
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
    });
  };
  get_seller_dashboard_data = async (req, res) => {
    const id = req;
    const totalSale = await ShopWallet.aggregate([
      {
        $match: {
          sellerId: {
            $eq: id,
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
      sellerId: new Types.ObjectId(id),
    }).countDocuments();
    const totalOrder = await Customer.find({
      sellerId: new Types.ObjectId(id),
    }).countDocuments();
    const totalPendingOrder = await Order.find({
      $and: [
        {
          sellerId: {
            $eq: new Types.ObjectId(id),
          },
        },
        {
          deliveryStatus: {
            $eq: "pending",
          },
        },
      ],
    }).countDocuments();
    const recentsOrders = await Order.find({
      sellerId: new Types.ObjectId(id),
    }).limit(5);
    new SuccessResponse({
      message: "Get seller dashboard data successfully",
      data: {
        totalSale: totalSale.length > 0 ? totalSale[0].totalAmount : 0,
        totalProduct,
        totalOrder,
        totalPendingOrder,
        recentsOrders,
      },
    });
  };
}

module.exports = new DashBoardController();
