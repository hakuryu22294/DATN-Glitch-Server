const { Router } = require("express");
const { asyncHandler } = require("../../helpers/asyncHandler");
const CategoryController = require("../../controllers/category.controller");
const { authentication, checkPermisson } = require("../../auth/authUtils");

const categoryRouter = Router();
categoryRouter.get("/", asyncHandler(CategoryController.get_all_category));

categoryRouter.use(authentication);
categoryRouter.post(
  "/",
  checkPermisson("admin"),
  asyncHandler(CategoryController.add_category)
);

module.exports = categoryRouter;
