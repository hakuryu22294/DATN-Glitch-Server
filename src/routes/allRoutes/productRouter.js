const { Router } = require("express");
const productRouter = Router();
const ProductController = require("../../controllers/product.controller");
const { asyncHandler } = require("../../helpers/asyncHandler");
const { authentication, checkPermisson } = require("../../auth/authUtils");

productRouter.get(
  "/",
  authentication,
  asyncHandler(ProductController.get_product)
);

productRouter.get(
  "/:productId",
  asyncHandler(ProductController.get_one_product)
);

productRouter.post(
  "/",
  authentication,
  checkPermisson("seller"),
  asyncHandler(ProductController.add_product)
);

productRouter.post(
  "/upload",
  authentication,
  checkPermisson("seller"),
  asyncHandler(ProductController.upload_images_product)
);

productRouter.patch(
  "/update",
  authentication,
  checkPermisson("seller"),
  asyncHandler(ProductController.update_product)
);
productRouter.post(
  "/image/upload",
  authentication,
  checkPermisson("seller"),
  asyncHandler(ProductController.product_img_update)
);

module.exports = productRouter;
