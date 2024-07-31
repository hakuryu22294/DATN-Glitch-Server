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
    console.log(id);
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
    const totalOrder = await Order.find({
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
    console.log(totalProduct);
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
