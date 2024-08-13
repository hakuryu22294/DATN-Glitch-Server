const { BadRequestError } = require("../core/error.response");
const { SuccessResponse } = require("../core/success.response");
const { Product } = require("../models/product.schema");
const { Review } = require("../models/review.schema");

class ShopController {
  get_average_rating = async (req, res) => {
    const { sellerId } = req.params;
    const products = await Product.find({ sellerId });
    const reviews = await Review.find({
      productId: { $in: products.map((p) => p._id) },
    });
    if (reviews.length === 0) throw BadRequestError("No reviews found");
    let totalRating = 0;
    reviews.forEach((review) => {
      totalRating += review.rating;
    });
    const averageRating = totalRating / reviews.length;
    new SuccessResponse({
      message: "Get average rating successfully",
      data: averageRating,
    }).send(res);
  };

  get_products = async (req, res) => {
    const { sellerId } = req.params;
    const { sortBy, page = 1, limit = 10, search = "" } = req.query;

    const pageNumber = parseInt(page, 10);
    const pageSize = parseInt(limit, 10);
    const skip = (pageNumber - 1) * pageSize;
    let sortOption;
    switch (sortBy) {
      case "oldest":
        sortOption = { createdAt: 1 };
        break;
      case "rating":
        sortOption = { rating: -1 };
        break;
      case "price-asc":
        sortOption = { price: 1 };
        break;
      case "price-desc":
        sortOption = { price: -1 };
        break;
      default:
        sortOption = { createdAt: -1 };
        break;
    }
    const products = await Product.find({
      sellerId,
      name: { $regex: search, $options: "i" },
    })
      .sort(sortOption)
      .skip(skip)
      .limit(pageSize);
    new SuccessResponse({
      message: "Get products successfully",
      data: products,
    }).send(res);
  };
  get_shop_info = async (req, res) => {
    const { sellerId } = req.params;
    const shopInfo = await Product.findOne({ sellerId });
    new SuccessResponse({
      message: "Get shop info successfully",
      data: shopInfo,
    }).send(res);
  };
  get_all_reviews = async (req, res) => {
    const products = await Product.find({ sellerId }).select("_id name");
  };
}

module.exports = new ShopController();
