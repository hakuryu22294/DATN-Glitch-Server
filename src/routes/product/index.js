const { Router } = require("express");
const ProductController = require("../../controllers/product.controller");
const { asyncHandler } = require("../../helpers/asyncHandler");
const { authentication } = require("../../auth/authUtils");

const productRouter = Router();
productRouter.get(
  "/search/:keySearch",
  asyncHandler(ProductController.getListSearchProducts)
);
productRouter.get("/", asyncHandler(ProductController.findAllProducts));
productRouter.get("/:id", asyncHandler(ProductController.findProduct));

productRouter.use(authentication);
productRouter.post("/create", asyncHandler(ProductController.createProduct));
productRouter.post(
  "/published/:id",
  asyncHandler(ProductController.publishProductByShop)
);
productRouter.patch("/:id", asyncHandler(ProductController.updateProduct));
productRouter.post(
  "/unpublished/:id",
  asyncHandler(ProductController.unPublishProductByShop)
);

productRouter.get(
  "/draft/all",
  asyncHandler(ProductController.getAllDraftForShop)
);
productRouter.get(
  "/published/all",
  asyncHandler(ProductController.getAllPublishForShop)
);

module.exports = productRouter;
