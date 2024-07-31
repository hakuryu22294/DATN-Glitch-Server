const { Router } = require("express");
const { asyncHandler } = require("../../helpers/asyncHandler");
const AccessController = require("../../controllers/access.controller");
const { authentication } = require("../../auth/authUtils");

const managerAuthRouter = Router();

managerAuthRouter.post(
  "/admin/login",
  asyncHandler(AccessController.admin_login)
);
managerAuthRouter.post(
  "/seller/register",
  asyncHandler(AccessController.seller_register)
);

managerAuthRouter.post(
  "/profile-image-upload",
  authentication,
  AccessController.profile_image_upload
);

managerAuthRouter.get(
  "/profile-info",
  authentication,
  asyncHandler(AccessController.get_user)
);
managerAuthRouter.post(
  "/profile-info-add",
  authentication,
  asyncHandler(AccessController.profile_info_add)
);

module.exports = managerAuthRouter;
