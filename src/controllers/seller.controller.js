const { BadRequestError } = require("../core/error.response");
const { SuccessResponse } = require("../core/success.response");
const { getAllSeller, getSellerById } = require("../models/repo/seller.repo");
const { Seller } = require("../models/seller.schema");

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
    if (!seller) throw new BadRequestError("Seller don't found");
    new SuccessResponse({
      message: "Get seller successfully",
      data: seller,
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
