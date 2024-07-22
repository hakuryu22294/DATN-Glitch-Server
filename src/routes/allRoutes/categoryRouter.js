const { Router } = require("express");
const categoryRouter = Router();
const CategoryController = require("../../controllers/category.controller");
const { asyncHandler } = require("../../helpers/asyncHandler");

categoryRouter.get("/", asyncHandler(CategoryController.get_all_category));
categoryRouter.post("/", asyncHandler(CategoryController.add_category));
module.exports = categoryRouter;
