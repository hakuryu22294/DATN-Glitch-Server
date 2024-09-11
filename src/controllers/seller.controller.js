const { BadRequestError } = require("../core/error.response");
const { SuccessResponse } = require("../core/success.response");
const { getAllSeller, getSellerById } = require("../models/repo/seller.repo");
const { Seller } = require("../models/seller.schema");
const { Product } = require("../models/product.schema");
const { Review } = require("../models/review.schema");
const { Order } = require("../models/order.schema");

class SellerController {
  get_all_seller = async (req, res) => {
    const { page, searchValue, parPage } = req.query;
    const { sellers, total } = await getAllSeller({
      parPage,
      searchValue,
      page,
    });

    if (!sellers) throw new BadRequestError("Seller don't found");
    new SuccessResponse({
      message: "Get all seller successfully",
      data: { sellers, total },
    }).send(res);
  };
  get_seller = async (req, res) => {
    const { sellerId } = req.params;
    const seller = await getSellerById({ sellerId });
    if (!seller) throw new BadRequestError("Seller not found");

    const productReviews = await Review.find({
      productId: { $in: await Product.find({ sellerId }).select("_id") },
    });
    const totalRating = productReviews.reduce(
      (acc, review) => acc + review.rating,
      0
    );
    const shopRating =
      productReviews.length > 0 ? totalRating / productReviews.length : 0;

    const totalSold = await Order.aggregate([
      { $match: { sellerId: seller._id, paymentStatus: "paid" } },
      { $unwind: "$products" },
      { $group: { _id: null, totalSold: { $sum: "$products.quantity" } } },
    ]);

    // Tính số lượng sản phẩm
    const totalProducts = await Product.countDocuments({ sellerId });

    // Chuẩn bị dữ liệu trả về
    const sellerData = {
      sellerInfo: seller,
      shopRating: shopRating.toFixed(2),
      totalSold: totalSold[0]?.totalSold || 0,
      totalProducts,
    };

    new SuccessResponse({
      message: "Get seller successfully",
      data: sellerData,
    }).send(res);
  };

  seller_status_update = async (req, res) => {
    const { sellerId, status } = req.body;
    console.log(sellerId, status);
    const statusUpdatedSeller = await Seller.findByIdAndUpdate(
      {
        _id: sellerId,
      },
      {
        status: status,
      },
      {
        new: true,
      }
    );
    statusUpdatedSeller.save();
    console.log(statusUpdatedSeller);
    if (!statusUpdatedSeller) throw new BadRequestError("Seller don't found");
    new SuccessResponse({
      message: "Update seller status successfully",
      data: statusUpdatedSeller,
    }).send(res);
  };
  get_deactive_seller = async (req, res) => {
    let { page, parPage, searchValue } = req.query;
    parPage = parseInt(parPage);
    page = parseInt(page);
    const skipPage = parPage * (page - 1);
    if (searchValue) {
      const sellers = await Seller.find({
        $text: {
          $search: searchValue,
        },
        status: "deactive",
      })
        .skip(skipPage)
        .limit(parPage)
        .sort({ createdAt: -1 });
      const totalSeller = await Seller.find({
        $text: {
          $search: searchValue,
        },
        status: "deactive",
      }).countDocuments();
      new SuccessResponse({
        message: "Get deactive seller successfully",
        data: { sellers, totalSeller },
      }).send(res);
    } else {
      const seller = await Seller.find({ status: "deactive" })
        .skip(skipPage)
        .limit(parPage)
        .sort({ createdAt: -1 });
      const totalSeller = await Seller.find({
        status: "deactive",
      }).countDocuments();
      new SuccessResponse({
        message: "Get deactive seller successfully",
        data: { seller, totalSeller },
      }).send(res);
    }
  };
  get_active_seller = async (req, res) => {
    let { page, parPage, searchValue } = req.query;
    parPage = parseInt(parPage);
    page = parseInt(page);
    const skipPage = parPage * (page - 1);
    if (searchValue) {
      const sellers = await Seller.find({
        $text: {
          $search: searchValue,
        },
        status: "active",
      })
        .skip(skipPage)
        .limit(parPage)
        .sort({ createdAt: -1 });
      const totalSeller = await Seller.find({
        $text: {
          $search: searchValue,
        },
        status: "active",
      }).countDocuments();
      new SuccessResponse({
        message: "Get active seller successfully",
        data: { sellers, totalSeller },
      }).send(res);
    } else {
      const seller = await Seller.find({ status: "active" })
        .skip(skipPage)
        .limit(parPage)
        .sort({ createdAt: -1 });
      const totalSeller = await Seller.find({
        status: "active",
      }).countDocuments();
      new SuccessResponse({
        message: "Get active seller successfully",
        data: { seller, totalSeller },
      }).send(res);
    }
  };
}

module.exports = new SellerController();
