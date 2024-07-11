const { Router } = require("express");
const ProductController = require("../../controllers/product.controller");
const { asyncHandler } = require("../../helpers/asyncHandler");

const productRouter = Router();

productRouter.post("/create", asyncHandler(ProductController.createProduct));

productRouter.get(
  "/draft/all",
  asyncHandler(ProductController.getAllDraftForShop)
);

module.exports = productRouter;
