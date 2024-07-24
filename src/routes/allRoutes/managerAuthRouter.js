const { Router } = require("express");
const { asyncHandler } = require("../../helpers/asyncHandler");
const AccessController = require("../../controllers/access.controller");
const { authentication } = require("../../auth/authUtils");

const managerAuthRouter = Router();

managerAuthRouter.post(
  "/seller/login",
  asyncHandler(AccessController.seller_login)
);
managerAuthRouter.post(
  "/admin/login",
  asyncHandler(AccessController.admin_login)
);
managerAuthRouter.post(
  "/seller/register",
  asyncHandler(AccessController.seller_register)
);
managerAuthRouter.use(authentication);

managerAuthRouter.post(
  "/profile-image-upload",
  AccessController.profile_image_upload
);

managerAuthRouter.get("/profile-info", asyncHandler(AccessController.get_user));
managerAuthRouter.post(
  "/profile-info-add",
  asyncHandler(AccessController.profile_info_add)
);
managerAuthRouter.get("/logout", asyncHandler(AccessController.logout));

module.exports = managerAuthRouter;
