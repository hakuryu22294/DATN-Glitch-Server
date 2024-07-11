const ProductService = require("../services/product.service");
const { SuccessResponse } = require("../core/success.response");

class ProductController {
  createProduct = async (req, res, next) => {
    new SuccessResponse({
      message: "Create product successfully",
      metadata: await ProductService.createProduct(req.body.type, {
        ...req.body,
        shop: req.user.userId,
      }),
    }).send(res);
  };
  //query
  /**
   * @desc Get all draft
   * @route GET /api/v1/product/draft/all
   * @param {Number} limit
   * @param {Number} skip
   * @return {JSON}
   */
  getAllDraftForShop = async (req, res, next) => {
    new SuccessResponse({
      message: "Get all draft successfully",
      metadata: await ProductService.findAllDraftsForShop({
        shop: req.user.userId,
      }),
    }).send(res);
  };
}

module.exports = new ProductController();
