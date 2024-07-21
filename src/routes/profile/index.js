const { Router } = require("express");
const ProfileController = require("../../controllers/profile.controller");
const grantAccess = require("../../middlewares/rbac");

const profileRouter = Router();

profileRouter.get(
  "/viewAny",
  grantAccess("readAny", "profile"),
  ProfileController.profiles
);

profileRouter.get(
  "/viewOwn",
  grantAccess("readOwn", "profile"),
  ProfileController.profile
);

module.exports = profileRouter;
