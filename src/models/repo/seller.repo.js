const { Seller } = require("../seller.schema");

const getAllSeller = async ({ searchValue, parPage, page }) => {
  let skipPage = 0;
  if (parPage && page) {
    skipPage = parseInt(parPage) * parseInt(page) - 1;
  }
  let seller = [],
    total = 0;
  if (!searchValue) {
    seller = await Seller.find({
      status: "pending",
    })
      .skip(skipPage)
      .limit(parseInt(parPage))
      .sort({ createdAt: -1 })
      .lean();
  } else {
    seller = await Seller.find({
      $text: {
        $search: searchValue,
      }
        .skip(skipPage)
        .limit(parseInt(parPage))
        .sort({ createdAt: -1 }),
    }).lean();
  }
  total = seller.length;

  return { seller, total };
};

const getActiveSeller = async ({ searchValue, parPage, page }) => {
  let skipPage = 0;
  if (parPage && page) {
    skipPage = parseInt(parPage) * parseInt(page) - 1;
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
    skipPage = parseInt(parPage) * parseInt(page) - 1;
  }
  let seller = [],
    total = 0;
  if (!searchValue) {
    seller = await Seller.find({
      status: "deactive",
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
module.exports = {
  getAllSeller,
  getActiveSeller,
  getDeActiveSeller,
  getSellerById,
};
