const { Router } = require("express");
const productRouter = Router();
const ProductController = require("../../controllers/product.controller");
const { asyncHandler } = require("../../helpers/asyncHandler");

productRouter.get("/", asyncHandler(ProductController.get_product));

productRouter.get(
  "/:productId",
  asyncHandler(ProductController.get_one_product)
);

productRouter.post("/", asyncHandler(ProductController.add_product));

productRouter.patch(
  "/update/:productId",
  asyncHandler(ProductController.update_product)
);
productRouter.post(
  "/image/upload",
  asyncHandler(ProductController.product_img_update)
);

module.exports = productRouter;
