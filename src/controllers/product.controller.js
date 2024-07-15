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
  updateProduct = async (req, res, next) => {
    new SuccessResponse({
      message: "Update product successfully",
      metadata: await ProductService.updateProduct(req.body.type, {
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
  getAllPublishForShop = async (req, res, next) => {
    new SuccessResponse({
      message: "Get all publish successfully",
      metadata: await ProductService.findAllPublishForShop({
        shop: req.user.userId,
      }),
    }).send(res);
  };

  publishProductByShop = async (req, res, next) => {
    new SuccessResponse({
      message: "Publish product successfully",
      metadata: await ProductService.findAllPublishForShop({
        _id: req.params.id,
        shop: req.user.userId,
      }),
    }).send(res);
  };

  unPublishProductByShop = async (req, res, next) => {
    new SuccessResponse({
      message: "Unpublish product successfully",
      metadata: await ProductService.findAllPublishForShop({
        _id: req.params.id,
        shop: req.user.userId,
      }),
    }).send(res);
  };

  getListSearchProducts = async (req, res, next) => {
    new SuccessResponse({
      message: "Search product successfully",
      metadata: await ProductService.searchProducts(req.params),
    }).send(res);
  };
  findAllProducts = async (req, res, next) => {
    new SuccessResponse({
      message: "Get all products successfully",
      metadata: await ProductService.findAllProducts(req.query),
    }).send(res);
  };
  findProduct = async (req, res, next) => {
    new SuccessResponse({
      message: "Get product successfully",
      metadata: await ProductService.findProduct({
        _id: req.params.id,
      }),
    }).send(res);
  };
}

module.exports = new ProductController();
