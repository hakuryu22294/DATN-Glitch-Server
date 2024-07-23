const { Router } = require("express");
const { asyncHandler } = require("../../helpers/asyncHandler");
const AccessController = require("../../controllers/access.controller");
const { authentication } = require("../../auth/authUtils");

const managerAuthRouter = Router();

managerAuthRouter.post("/seller/login", AccessController.seller_login);
managerAuthRouter.post("/admin/login", AccessController.admin_login);
managerAuthRouter.post("/seller/register", AccessController.seller_register);

managerAuthRouter.use(authentication);
managerAuthRouter.post(
  "/profile-image-upload",
  AccessController.profile_image_upload
);
managerAuthRouter.post("/profile-info-add", AccessController.profile_info_add);
managerAuthRouter.get("/logout", AccessController.logout);

module.exports = managerAuthRouter;
