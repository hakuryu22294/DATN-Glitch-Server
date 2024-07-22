const { BadRequestError } = require("../core/error.response");
const { SuccessResponse } = require("../core/success.response");
const { getAllSeller, getSellerById } = require("../models/repo/seller.repo");
const { Seller } = require("../models/seller.schema");

class SellerController {
  get_all_seller = async (req, res) => {
    const { page, searchValue, parPage } = req.query;
    const { seller, total } = await getAllSeller({
      parPage,
      searchValue,
      page,
    });
    if (!seller) throw new BadRequestError("Seller don't found");
    new SuccessResponse({
      message: "Get all seller successfully",
      data: { seller, total },
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
    const statusUpdatedSeller = await Seller.findByIdAndUpdate({
      _id: sellerId,
      status,
    });
    if (!statusUpdatedSeller) throw new BadRequestError("Seller don't found");
    new SuccessResponse({
      message: "Update seller status successfully",
      data: statusUpdatedSeller,
    }).send(res);
  };
}

module.exports = new SellerController();
