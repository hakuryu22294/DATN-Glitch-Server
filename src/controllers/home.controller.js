const { Types } = require("mongoose");
const { SuccessResponse } = require("../core/success.response");
const { Category } = require("../models/category.schema");
const { Product } = require("../models/product.schema");
const QueryProduct = require("../models/repo/home.repo");
const { Review } = require("../models/review.schema");

const moment = require("moment");
const { BadRequestError } = require("../core/error.response");

class HomeController {
  formateProduct = (products) => {
    const productArr = [];
    let temp = [];

    for (let i = 0; i < products.length; i++) {
      temp.push(products[i]);
      if (temp.length === 3 || i === products.length - 1) {
        productArr.push(temp);
        temp = [];
      }
    }

    return productArr;
  };
  get_categories = async (req, res) => {
    const categories = await Category.find();
    new SuccessResponse({
      message: "Get categories successfully",
      data: categories,
    }).send(res);
  };
  get_products = async (req, res) => {
    const products = await Product.find({}).limit(30).sort({ createAt: -1 });
    const allProduct1 = await Product.find({}).limit(9).sort({ createAt: -1 });
    const latestProduct = this.formateProduct(allProduct1);
    const allProduct2 = await Product.find({}).limit(9).sort({ rating: -1 });
    const topRateProduct = this.formateProduct(allProduct2);
    const allProduct3 = await Product.find({}).limit(9).sort({ discount: -1 });
    const topDiscountProduct = this.formateProduct(allProduct3);
    new SuccessResponse({
      message: "Get products successfully",
      data: {
        products,
        latestProduct,
        topRateProduct,
        topDiscountProduct,
      },
    }).send(res);
  };
  price_range_product = async (req, res) => {
    const priceRange = {
      low: 0,
      high: 0,
    };
    const products = await Product.find({}).limit(9).sort({
      createAt: -1,
    });
    const latestProduct = this.formateProduct(products);
    const getForPrice = await Product.find({}).sort({
      "price": 1,
    });
    if (getForPrice.length > 0) {
      priceRange.high = getForPrice[getForPrice.length - 1].price;
      priceRange.low = getForPrice[0].price;
    }

    new SuccessResponse({
      message: "Get products successfully",
      data: {
        latestProduct,
        priceRange,
      },
    }).send(res);
  };
  query_products = async (req, res) => {
    const parPage = 30;
    req.query.parPage = parPage;
    const products = await Product.find({}).sort({ createAt: -1 });
    const totalProduct = new QueryProduct(products, req.query)
      .categoriesQuery()
      .ratingQuery()
      .searchQuery()
      .priceQuery()
      .sortByPrice()
      .countProducts();
    const result = new QueryProduct(products, req.query)
      .categoriesQuery()
      .ratingQuery()
      .searchQuery()
      .priceQuery()
      .getProducts();

    new SuccessResponse({
      message: "Get products successfully",
      data: {
        products: result,
        totalProduct,
        parPage,
      },
    }).send(res);
  };
  product_details = async (req, res) => {
    const { slug } = req.params;
    const product = await Product.findOne({ slug });
    if (!product) throw new BadRequestError("Product don't found");
    const relatedProducts = await Product.find({
      $and: [
        {
          _id: { $ne: product._id },
        },
        {
          category: {
            $eq: product.category,
          },
        },
      ],
    }).limit(12);
    const moreProduct = await Product.find({
      $and: [
        {
          _id: { $ne: product._id },
        },
        {
          sellerId: {
            $eq: product.sellerId,
          },
        },
      ],
    }).limit(3);
    new SuccessResponse({
      message: "Get product details successfully",
      data: {
        product,
        relatedProducts,
        moreProduct,
      },
    }).send(res);
  };
  submit_review = async (req, res) => {
    const { productId, rating, review, name } = req.body;
    await Review.create({
      productId,
      rating,
      review,
      name,
      date: moment(Date.now()).format("LL"),
    });
    let rate = 0;
    const reviews = await Review.find({ productId });
    for (let i = 0; i < reviews.length; i++) {
      rate += reviews[i].rating;
    }
    let productRating = 0;
    if (reviews.length > 0) productRating = (rate / reviews.length).toFixed(1);
    await Product.findOneAndUpdate(
      { _id: productId },
      { rating: productRating }
    );

    new SuccessResponse({
      message: "Submit review successfully",
    }).send(res);
  };
  get_reviews = async (req, res) => {
    const { productId } = req.params;
    let { pageNo } = req.query;
    pageNo = parseInt(pageNo);
    const limit = 5;
    const skipPage = limit * (pageNo - 1);
    let getRating = await Review.aggregate([
      {
        $match: {
          productId: {
            $eq: new Types.ObjectId(productId),
          },
          rating: {
            $not: {
              $size: 0,
            },
          },
        },
      },
      {
        $unwind: "$rating",
      },
      {
        $group: {
          _id: "$rating",
          count: {
            $sum: 1,
          },
        },
      },
    ]);
    let ratingReview = [
      {
        rating: 5,
        sum: 0,
      },
      {
        rating: 4,
        sum: 0,
      },
      {
        rating: 3,
        sum: 0,
      },
      {
        rating: 2,
        sum: 0,
      },
      {
        rating: 1,
        sum: 0,
      },
    ];
    for (let i = 0; i < ratingReview.length; i++) {
      for (let j = 0; j < getRating.length; j++) {
        if (ratingReview[i].rating === getRating[j]._id) {
          ratingReview[i].sum = getRating[j].count;
          break;
        }
      }
    }
    const getAll = await Review.find({ productId: productId });

    const reviews = await Review.find({ productId: productId })
      .sort({ date: -1 })
      .skip(skipPage)
      .limit(limit);
    console.log(reviews, getAll.length, ratingReview);
    new SuccessResponse({
      message: "Get reviews successfully",
      data: {
        reviews,
        totalReview: getAll.length,
        ratingReview,
      },
    }).send(res);
  };
}

module.exports = new HomeController();
