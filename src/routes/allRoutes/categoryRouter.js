const { Router } = require("express");
const { asyncHandler } = require("../../helpers/asyncHandler");
const CategoryController = require("../../controllers/category.controller");

const categoryRouter = Router();
categoryRouter.get("/", asyncHandler(CategoryController.get_all_category));

categoryRouter.post("/", asyncHandler(CategoryController.add_category));

module.exports = categoryRouter;
