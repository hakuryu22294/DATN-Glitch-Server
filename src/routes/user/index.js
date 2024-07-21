const { Router } = require("express");
const UserController = require("../../controllers/user.controller");
const { asyncHandler } = require("../../helpers/asyncHandler");

const userRouter = Router();

userRouter.post("/new", asyncHandler(UserController.newUser));
userRouter.get("/verify", asyncHandler(UserController.checkLoginEmailToken));
module.exports = userRouter;
