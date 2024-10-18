const { Types } = require("mongoose");
const { SuccessResponse } = require("../core/success.response");
const { Category } = require("../models/category.schema");
const { Product } = require("../models/product.schema");
const QueryProduct = require("../models/repo/home.repo");
const { Review } = require("../models/review.schema");

const moment = require("moment");
const { BadRequestError } = require("../core/error.response");
const { Seller } = require("../models/seller.schema");
const { Order } = require("../models/order.schema");
const { CustomerWallet } = require("../models/customerWallet");

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
    const products = await Product.find({ status: "published" })
      .populate({
        path: "sellerId",
        select: "shopInfo",
      })
      .limit(30)
      .sort({ createAt: -1 });
    const allProduct1 = await Product.find({ status: "published" })
      .limit(9)
      .sort({ createAt: -1 });
    const latestProduct = this.formateProduct(allProduct1);
    const allProduct2 = await Product.find({ status: "published" })
      .limit(9)
      .sort({ rating: -1 });
    const topRateProduct = this.formateProduct(allProduct2);
    const allProduct3 = await Product.find({ status: "published" })
      .limit(9)
      .sort({ discount: -1 });
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
    const products = await Product.find({ status: "published" }).limit(9).sort({
      createAt: -1,
    });
    const latestProduct = this.formateProduct(products);
    const getForPrice = await Product.find({ status: "published" }).sort({
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
    const parPage = parseInt(req.query.parPage) || 12;
    req.query.parPage = parPage;
    const products = await Product.find({ status: "published" }).sort({
      createAt: -1,
    });
    const totalProduct = new QueryProduct(products, req.query)
      .categoriesQuery()
      .ratingQuery()
      .searchQuery()
      .priceQuery()
      .countProducts();
    const result = new QueryProduct(products, req.query)
      .categoriesQuery()
      .ratingQuery()
      .searchQuery()
      .priceQuery()
      .sortByPrice()
      .skip()
      .limit();

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
    const { productId, rating, review, name, orderId, customerId } = req.body;
    const order = await Order.findOne({ _id: orderId, customerId });
    if (!order) {
      throw new BadRequestError(
        "Bạn không có quyền đánh giá sản phẩm này."
      ).send(res);
    }

    // Kiểm tra xem sản phẩm có trong đơn hàng không
    const purchasedProduct = order.products.find(
      (product) => product._id.toString() === productId.toString()
    );
    if (!purchasedProduct) {
      throw new BadRequestError("Sản phẩm này không có trong đơn hàng.").send(
        res
      );
    }

    // Bước 2: Kiểm tra xem người dùng đã đánh giá sản phẩm này trong đơn hàng chưa
    const existingReview = await Review.findOne({
      customerId,
      productId,
      orderId,
    });
    if (existingReview) {
      throw new BadRequestError(
        "Bạn đã đánh giá sản phẩm này trong đơn hàng rồi."
      );
    }

    // Bước 3: Tạo đánh giá mới
    await Review.create({
      productId,
      rating,
      review,
      name,
      orderId,
      customerId,
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
      .populate({
        path: "customerId",
        select: "name",
      })
      .sort({ date: -1 })
      .skip(skipPage)
      .limit(limit);

    new SuccessResponse({
      message: "Get reviews successfully",
      data: {
        reviews,
        totalReview: getAll.length,
        ratingReview,
      },
    }).send(res);
  };

  get_shop_data = async (req, res) => {
    const { sellerId } = req.params;
    const {
      priceRange,
      sort = "low-to-high",
      subCategory = "all",
      pageNumber = 1,
      pageSize = 10,
    } = req.query;

    // Tìm shop
    const shop = await Seller.findById(sellerId).select(
      "shopInfo subCategories shopRatting"
    );
    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }

    // Tính toán shopRating
    const products = await Product.find({ sellerId, status: "published" });
    const ratings = products.map((product) => product.rating);
    const shopRating =
      ratings.length > 0
        ? ratings.reduce((acc, rating) => acc + rating, 0) / ratings.length
        : 0;

    // Cập nhật shopRating
    await Seller.findByIdAndUpdate(sellerId, { shopRatting: shopRating });

    // Tìm sản phẩm theo subCategory
    const filter = { sellerId };
    if (subCategory !== "all") {
      filter.subCategory = subCategory;
    }

    // Tạo đối tượng truy vấn mới để tránh lỗi "Query was already executed"
    const productsQuery = Product.find(filter);

    // Sắp xếp sản phẩm
    if (sort === "low-to-high") {
      productsQuery.sort({ price: 1 });
    } else if (sort === "high-to-low") {
      productsQuery.sort({ price: -1 });
    }

    // Phân trang
    const totalProducts = await Product.countDocuments(filter);
    const productsList = await productsQuery
      .skip((pageNumber - 1) * pageSize)
      .limit(parseInt(pageSize));

    // Nhóm sản phẩm theo subCategory
    const groupedProducts = productsList.reduce((acc, product) => {
      const key = product.subCategory || "Uncategorized";
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(product);
      return acc;
    }, {});
    const allProducts = await Product.find({ sellerId, status: "published" });
    new SuccessResponse({
      message: "Get shop data successfully",
      data: {
        shop,
        products: groupedProducts,
        totalProducts,
        allProducts,
      },
    }).send(res);
  };
  total_customer_wallet = async (req, res) => {
    const { customerId } = req.params;
    console.log(customerId);
    const wallets = await CustomerWallet.find({ customerId });

    // Tính tổng số tiền
    const totalAmount = wallets.reduce(
      (total, wallet) => total + wallet.amount,
      0
    );

    new SuccessResponse({
      message: "Get total customer wallet successfully",
      data: {
        totalAmount,
      },
    }).send(res);
  };
}

module.exports = new HomeController();
