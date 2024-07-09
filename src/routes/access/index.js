const { Router } = require("express");
const AccessController = require("../../controllers/access.controller");
const accessRouter = Router();

accessRouter.post("/shop/sign-up", AccessController.signUp);

module.exports = accessRouter;
