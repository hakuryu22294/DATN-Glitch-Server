const { Product } = require("../product.schema");
const { Review } = require("../review.schema");
const { Seller } = require("../seller.schema");

const getAllSeller = async ({ searchValue, parPage, page }) => {
  let skipPage = 0;
  if (parPage && page) {
    skipPage = parseInt(parPage) * (parseInt(page) - 1);
  }
  let sellers = [],
    total = 0;
  if (!searchValue) {
    sellers = await Seller.find({})
      .skip(skipPage)
      .limit(parseInt(parPage))
      .sort({ createdAt: -1 });
  } else {
    sellers = await Seller.find({
      $text: {
        $search: searchValue,
      },
    })
      .skip(skipPage)
      .limit(parseInt(parPage))
      .sort({ createdAt: -1 });
  }
  total = sellers.length;

  return { sellers, total };
};

const getActiveSeller = async ({ searchValue, parPage, page }) => {
  let skipPage = 0;
  if (parPage && page) {
    skipPage = parseInt(parPage) * (parseInt(page) - 1);
  }
  let seller = [],
    total = 0;
  if (!searchValue) {
    seller = await Seller.find({
      status: "active",
    })
      .skip(skipPage)
      .limit(parseInt(parPage))
      .sort({ createdAt: -1 })
      .lean();
  } else {
    seller = await Seller.find({
      $text: {
        $search: searchValue,
      },
      status: "active",
    })
      .skip(skipPage)
      .limit(parseInt(parPage))
      .sort({ createdAt: -1 })
      .lean();
  }
  total = seller.length;
  return { seller, total };
};

const getDeActiveSeller = async ({ searchValue, parPage, page }) => {
  let skipPage = 0;
  if (parPage && page) {
    skipPage = parseInt(parPage) * (parseInt(page) - 1);
  }
  let seller = [],
    total = 0;
  if (!searchValue) {
    seller = await Seller.find({
      status: "deactive",
    })
      .skip(skipPage)
      .limit(parseInt(parPage))
      .sort({ createdAt: -1 });
  } else {
    seller = await Seller.find({
      $text: {
        $search: searchValue,
      },
      status: "deactive",
    })
      .skip(skipPage)
      .limit(parseInt(parPage))
      .sort({ createdAt: -1 })
      .lean();
  }
  total = seller.length;
  return { seller, total };
};
const getSellerById = async ({ sellerId }) => {
  return await Seller.findOne({ _id: sellerId }).lean();
};

const calculateShopRating = async (sellerId) => {
  try {
    const products = await Product.find({ sellerId, rating: { $gt: 0 } })
      .select("_id")
      .lean();

    if (!products.length) {
      return 0;
    }

    const productIds = products.map((product) => product._id);

    const reviews = await Review.find({
      productId: { $in: productIds },
      rating: { $gt: 0 },
    }).lean();
    console.log(reviews);
    if (!reviews.length) {
      return 0;
    }

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;

    return averageRating.toFixed(2);
  } catch (error) {
    console.error("Error calculating shopRating:", error);
    throw new Error("Error calculating shopRating");
  }
};

const updateShopRatings = async () => {
  const sellers = await Seller.find();

  for (const seller of sellers) {
    const shopRating = await calculateShopRating(seller._id);
    console.log(shopRating);
    await Seller.findByIdAndUpdate(seller._id, { shopRatting: shopRating });
  }
};

module.exports = {
  getAllSeller,
  getActiveSeller,
  getDeActiveSeller,
  getSellerById,
  updateShopRatings,
};
